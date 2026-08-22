import os
import re
import requests
from urllib.parse import urljoin

def download_disclosure_pdfs():
    url = "https://www.shrishikshayatanschool.com/mandatorydisclosure/"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    
    # Setting output_dir to '.' means it will save the PDFs directly in the folder you run it from!
    output_dir = '.' 
    
    print(f"Scanning {url} for PDFs...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Aggressive search for anything ending in .pdf
        pdf_links = re.findall(r'''href=["']([^"']+\.pdf[^"']*)["']''', response.text, re.IGNORECASE)
        
        unique_pdfs = set()
        for link in pdf_links:
            full_url = urljoin(url, link).split('?')[0] # Clean up any URL parameters
            unique_pdfs.add(full_url)
            
        if not unique_pdfs:
            print("No PDFs found directly in the HTML. Let me know if this happens!")
            return

        print(f"Found {len(unique_pdfs)} unique PDF links. Starting download...")
        
        download_count = 0
        for i, pdf_url in enumerate(unique_pdfs, 1):
            try:
                filename = pdf_url.split('/')[-1]
                print(f"[{i}/{len(unique_pdfs)}] Downloading: {filename}")
                
                pdf_response = requests.get(pdf_url, headers=headers, timeout=15)
                pdf_response.raise_for_status()
                
                filepath = os.path.join(output_dir, filename)
                with open(filepath, 'wb') as f:
                    f.write(pdf_response.content)
                    
                download_count += 1
            except Exception as e:
                print(f" -> Failed to download {pdf_url}: {e}")
                
        print(f"\nFinished! Successfully downloaded {download_count} PDFs into your folder.")
        
    except Exception as e:
        print(f"Error accessing the page: {e}")

if __name__ == "__main__":
    download_disclosure_pdfs()