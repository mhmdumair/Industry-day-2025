import os
import json
import re
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Scopes: we only need read-only access to metadata
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']

def authenticate():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def filename_to_key(name):
    return name.lower().replace('.pdf', '').replace('-', '_')

def list_files_in_folder(service, folder_id):
    files = []
    page_token = None
    while True:
        response = service.files().list(
            q=f"'{folder_id}' in parents and mimeType='application/pdf' and trashed=false",
            fields='nextPageToken, files(id, name)',
            pageToken=page_token
        ).execute()
        files.extend(response.get('files', []))
        page_token = response.get('nextPageToken', None)
        if not page_token:
            break
    return files

def main():
    folder_link = input("Enter public folder link or folder ID: ").strip()
    match = re.search(r'/folders/([a-zA-Z0-9_-]+)', folder_link)
    folder_id = match.group(1) if match else folder_link

    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    files = list_files_in_folder(service, folder_id)

    result = {}
    for file in files:
        key = filename_to_key(file['name'])
        result[key] = file['id']

    with open("cv_ids.json", "w") as f:
        json.dump(result, f, indent=4)
    print("✅ File saved to cv_ids.json")

if __name__ == '__main__':
    main()
