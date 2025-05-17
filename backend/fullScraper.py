import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import textwrap
import asyncio
import nest_asyncio
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from dotenv import load_dotenv
import litellm
from playwright.async_api import async_playwright

# Patch nested loops for Jupyter compatibility
nest_asyncio.apply()

# Load API key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("Missing GROQ_API_KEY")

litellm.api_key = GROQ_API_KEY
litellm.provider = "groq"

# Async scraper
async def scrape_markdown_from_url_async(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="networkidle")
        html = await page.content()
        await browser.close()

    soup = BeautifulSoup(html, "html.parser")
    return md(str(soup.body))

# Run async function in any environment
def scrape_markdown_from_url(url):
    return asyncio.get_event_loop().run_until_complete(scrape_markdown_from_url_async(url))

def chunk_markdown(markdown, chunk_size=3000):
    return textwrap.wrap(markdown, width=chunk_size)

import tiktoken

def count_tokens(text, model="groq/deepseek-r1-distill-llama-70b"):
    try:
        enc = tiktoken.encoding_for_model(model)
    except KeyError:
        enc = tiktoken.get_encoding("cl100k_base")  # fallback

    return len(enc.encode(text))

def extract_with_groq(chunk):
    try:
        res = litellm.completion(
            model="groq/meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract a list of professor names and emails. If there are no professors listed, don't respond with anything."
                        "Respond ONLY with lines in the format: Full Name, Email Address. If there are no professors listed, don't respond with anything."
                        "Do not explain or add any extra text. If there are no professors listed, don't respond with anything."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        "From the following text, extract names and emails for all Professors, Associate Professors, or Assistant Professors.If there are no professors listed, don't respond with anything.\n\n"
                        f"{chunk}"
                    )
                }
            ],
            max_tokens=512,
            temperature=0
        )
        return res["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"[ERROR]: {e}"

import csv

def append_string_to_csv(data_string, filename="professors.csv"):
    with open(filename, mode="a", newline='') as csvfile:
        writer = csv.writer(csvfile)
        lines = data_string.strip().split("\n")
        for line in lines:
            if ',' in line:
                name, email = map(str.strip, line.split(",", 1))
                if email and "edu" in email:
                    writer.writerow([name, email])

def extract_emails_from_markdown(url, filename):
        markdown = scrape_markdown_from_url(url)
        print(markdown)
        chunks = chunk_markdown(markdown)

        results = ""
        for i, chunk in enumerate(chunks):
            print(f"→ Processing chunk {i + 1}/{len(chunks)}")
            result = extract_with_groq(chunk)
            print(result)
            results +=result
            results+="\n"
        result = results
        print(result)
        append_string_to_csv(result, filename)

from googlesearch import search

def search_google_scholar_url(name, university, max_results=10):
    query = f"{name} {university} google scholar"
    print(f"🔍 Searching: {query}")
    results = list(search(query, num_results=max_results))
    for url in results:
        if "scholar.google.com/citations?" in url:
            print(f"✅ Found Google Scholar profile: {url}")
            return url
    return None

import requests
from bs4 import BeautifulSoup

def fetch_scholar_profile(url):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')
    except requests.RequestException as e:
        print(f"❌ Failed to fetch page: {e}")
        return None

def parse_scholar_profile(soup):
    if soup is None:
        return None

    data = {}

    # Name & affiliation
    data['name'] = soup.find('div', id='gsc_prf_in').text.strip() if soup.find('div', id='gsc_prf_in') else "Unknown"
    data['affiliation'] = soup.find('div', class_='gsc_prf_il').text.strip() if soup.find('div', class_='gsc_prf_il') else "N/A"

    # Metrics
    metrics = soup.find_all('td', class_='gsc_rsb_std')
    data['citations'] = metrics[0].text if len(metrics) >= 1 else "N/A"
    data['h_index'] = metrics[2].text if len(metrics) >= 3 else "N/A"

    # Publications
    articles = soup.find_all('tr', class_='gsc_a_tr')[:5]
    publications = []
    for article in articles:
        title_tag = article.find('a', class_='gsc_a_at')
        title = title_tag.text.strip() if title_tag else "Untitled"
        link = f"https://scholar.google.com{title_tag['href']}" if title_tag else ""
        authors_tag = article.find('div', class_='gs_gray')
        authors = authors_tag.text.strip() if authors_tag else ""

        # ✅ Extract year
        year_tag = article.find('span', class_='gsc_a_h')
        year = int(year_tag.text.strip()) if year_tag and year_tag.text.strip().isdigit() else None

        publications.append({
            'title': title,
            'link': link,
            'authors': authors,
            'year': year  # ✅ Include year in the publication dict
        })

    data['publications'] = publications
    return data

def format_as_markdown(profile):
    if profile is None:
        return "❌ Could not parse Google Scholar profile."

    md = f"# {profile['name']}\n"
    md += f"**Affiliation**: {profile['affiliation']}\n\n"
    md += f"- **Citations**: {profile['citations']}\n"
    md += f"- **h-index**: {profile['h_index']}\n\n"
    md += "## Recent Publications\n"
    for pub in profile['publications']:
        md += f"- [{pub['title']}]({pub['link']})"
        if pub.get('year'):
            md += f" ({pub['year']})"
        md += "\n"
        md += f"  - _{pub['authors']}_\n"
    return md

from urllib.parse import urlparse, parse_qs, urlencode

def transform_scholar_url(original_url):
    parsed = urlparse(original_url)
    query_params = parse_qs(parsed.query)

    # Add or overwrite required parameters
    query_params['view_op'] = ['list_works']
    query_params['sortby'] = ['pubdate']

    # Flatten query string (each param should be a string, not list)
    flat_query = {k: v[0] for k, v in query_params.items()}

    new_query = urlencode(flat_query)
    transformed_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{new_query}"
    
    return transformed_url
def get_scholar_markdown(name, university):
    url_og = search_google_scholar_url(name, university)
    if not url_og:
        return None

    url = transform_scholar_url(url_og)
    soup = fetch_scholar_profile(url)
    profile_data = parse_scholar_profile(soup)

    # ✅ Check if most recent paper is from 2023 or later
    years = [pub['year'] for pub in profile_data['publications'] if isinstance(pub['year'], int)]
    if not years or max(years) < 2023:
        return None

    return format_as_markdown(profile_data)

import re

def extract_titles(markdown: str) -> str:
    # Find all titles in square brackets
    titles = re.findall(r'\[(.*?)\]', markdown)
    # Join them into one string separated by periods or semicolons
    return '. '.join(titles)

import re

def extract_first_paper_info(markdown: str):
    # Match the first markdown-style link: [Title](URL)
    match = re.search(r'\[(.*?)\]\((.*?)\)', markdown)
    if match:
        title, link = match.group(1), match.group(2)
        return title, link
    else:
        return None, None

from sentence_transformers import SentenceTransformer, util
from category_examples import category_examples

# 1. Define the research fields (optional if you use keys from category_examples)
research_fields = list(category_examples.keys())

# 2. Flatten examples and store labels
paper_titles = []
paper_labels = []

for field, examples in category_examples.items():
    paper_titles.extend(examples)
    paper_labels.extend([field] * len(examples))

# 3. Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

# 4. Encode examples
example_embeddings = model.encode(paper_titles, convert_to_tensor=True)

# 5. Classify function
def classify_text(text):
    input_embedding = model.encode(text, convert_to_tensor=True)
    cosine_scores = util.cos_sim(input_embedding, example_embeddings)

    similarity_scores = {}
    for i, label in enumerate(paper_labels):
        score = cosine_scores[0][i].item()
        similarity_scores[label] = max(similarity_scores.get(label, 0), score)

    best_field = max(similarity_scores, key=similarity_scores.get)
    return best_field, similarity_scores

from playwright.sync_api import sync_playwright

def fetch_paper_description(paper_url):
    """Use Playwright to extract paper description from Google Scholar citation page."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(paper_url, wait_until="networkidle", timeout=10000)

            # Try several possible containers for the description
            content = page.content()
            soup = BeautifulSoup(content, "html.parser")
            desc = soup.find('div', class_='gsh_csp') or soup.find('div', class_='gs_rs') or soup.find('div', class_='gsh_small')
            browser.close()

            if desc:
                return desc.text.strip()
    except Exception as e:
        print(f"❌ Could not fetch paper description with Playwright: {e}")
    return "N/A"

def full_scrape_workflow(directory_url, university_name):
    markdown = scrape_markdown_from_url(directory_url)
    chunks = chunk_markdown(markdown)

    professor_entries = []
    for chunk in chunks:
        result = extract_with_groq(chunk)
        if result and not result.startswith("[ERROR]"):
            lines = result.strip().split("\n")
            for line in lines:
                if ',' in line:
                    name, email = map(str.strip, line.split(",", 1))
                    if email and "edu" in email:
                        professor_entries.append((name, email))

    all_professor_data = []
    for name, email in professor_entries:
        try:
            scholar_url = search_google_scholar_url(name, university_name)
            if not scholar_url:
                continue

            transformed_url = transform_scholar_url(scholar_url)
            soup = fetch_scholar_profile(transformed_url)
            profile_data = parse_scholar_profile(soup)

            # Use most recent valid paper: 2023 <= year <= 2025
            valid_paper = None
            for pub in profile_data["publications"]:
                year = pub.get("year")
                if isinstance(year, int) and 2023 <= year <= 2025:
                    valid_paper = pub
                    break
            if not valid_paper:
                continue

            paper_title = valid_paper["title"]
            paper_link = valid_paper["link"]
            paper_description = fetch_paper_description(paper_link)

            paper_titles_blob = '. '.join(pub['title'] for pub in profile_data["publications"])
            research_field, _ = classify_text(paper_titles_blob)

            row = [name, email, research_field, paper_title, paper_link, paper_description]
            all_professor_data.append(row)

        except Exception as e:
            print(f"❌ Error processing {name}: {e}")
            continue

    filename = university_name.replace(" ", "_") + ".csv"
    with open(filename, mode="a", newline='') as csvfile:
        writer = csv.writer(csvfile)
        for row in all_professor_data:
            writer.writerow(row)

    print(f"✅ Done. {len(all_professor_data)} professors written to {filename}")
    return all_professor_data

full_scrape_workflow("https://facultyprofiles.tufts.edu/search?by=text&type=user", "Tufts University")