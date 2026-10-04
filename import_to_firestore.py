"""
Automated Firestore Import Tool for Soumya Ranjan Mishra Academic Portfolio
Uses Firebase Auth REST API and Cloud Firestore REST API.
Requires zero npm dependencies - runs on standard Python 3.
"""

import sys
import json
import urllib.request
import urllib.error
import argparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

API_KEY = "AIzaSyBZVKKk5VD3QLdfLTgYdTk4KxR4bsrnZ-k"
PROJECT_ID = "soumya-ranjan-portfolio"

# Load the verified dataset
PORTFOLIO_DATA = {
    "profile": {
        "id": "main",
        "full_name": "Soumya Ranjan Mishra",
        "short_name": "Soumya Mishra",
        "prefix": "Mr.",
        "role": "Assistant Professor",
        "role_line": "GIET University, Gunupur · Computer Applications",
        "department": "Computer Applications",
        "institution": "GIET University, Gunupur",
        "location": "Berhampur, Odisha, India",
        "phone": "+91 89175 56682",
        "linkedin_url": "https://www.linkedin.com/in/mr-soumya",
        "hero_label": "ASSISTANT PROFESSOR · RESEARCHER · MENTOR",
        "description": "Assistant Professor working across Machine Learning, Artificial Intelligence, Software Engineering and research-oriented computing.",
        "about_title": "An educator, researcher and academic professional.",
        "about_text": "Dedicated to teaching, research and academic development in Artificial Intelligence, Machine Learning, and Computer Applications at GIET University, Gunupur.\n\nPassionate about mentoring students and conducting research in deep learning, remote sensing, and healthcare applications.",
        "stat_1_value": "3+",
        "stat_1_label": "Years at GIET",
        "stat_2_value": "5",
        "stat_2_label": "Publications",
        "stat_3_value": "M.Tech",
        "stat_3_label": "AI / ML",
        "hero_image_url": "photo.jpg"
    },
    "experiences": [
        {
            "id": "exp-1",
            "sort_order": 1,
            "title": "Assistant Professor",
            "organization": "GIET University, Gunupur",
            "start_date": "July 2025",
            "end_date": "Present",
            "location": "Gunupur, Odisha, India",
            "description": "Faculty member in the Department of Computer Applications, actively engaged in teaching core computer science courses, research guidance, and curriculum development.",
            "tags": "Teaching, Research, Machine Learning, Artificial Intelligence"
        },
        {
            "id": "exp-2",
            "sort_order": 2,
            "title": "Lecturer",
            "organization": "GIET University, Gunupur",
            "start_date": "September 2024",
            "end_date": "June 2025",
            "location": "Gunupur, Odisha, India",
            "description": "Delivered lectures, conducted laboratory sessions, and mentored undergraduate students in computing fundamentals.",
            "tags": "Lectures, Academics, Mentorship"
        },
        {
            "id": "exp-3",
            "sort_order": 3,
            "title": "Teaching Assistant",
            "organization": "GIET University, Gunupur",
            "start_date": "January 2024",
            "end_date": "August 2024",
            "location": "Gunupur, Odisha, India",
            "description": "Assisted faculty with laboratory instructions, coursework grading, student queries, and academic tutorials.",
            "tags": "Teaching Assistant, Academic Support"
        },
        {
            "id": "exp-4",
            "sort_order": 4,
            "title": "Research Assistant",
            "organization": "GIET University, Gunupur",
            "start_date": "July 2023",
            "end_date": "December 2023",
            "location": "Gunupur, Odisha, India",
            "description": "Assisted with computational research projects in machine learning, data processing, and predictive modeling.",
            "tags": "Research, Data Processing, ML Models"
        },
        {
            "id": "exp-5",
            "sort_order": 5,
            "title": "Intern",
            "organization": "GIET University, Gunupur",
            "start_date": "March 2023",
            "end_date": "June 2023",
            "location": "Gunupur, Odisha, India",
            "description": "Academic internship focusing on software development and institutional computing projects.",
            "tags": "Internship, Software Development"
        },
        {
            "id": "exp-6",
            "sort_order": 6,
            "title": "Intern",
            "organization": "InternPe",
            "start_date": "October 2023",
            "end_date": "November 2023",
            "location": "Remote",
            "description": "Internship program focused on hands-on practical software development and coding challenges.",
            "tags": "Internship, Practical Coding"
        },
        {
            "id": "exp-7",
            "sort_order": 7,
            "title": "Intern",
            "organization": "SYNC Intern's",
            "start_date": "October 2023",
            "end_date": "November 2023",
            "location": "Remote",
            "description": "Hands-on project work in web technologies and software implementations.",
            "tags": "Internship, Web Technologies"
        },
        {
            "id": "exp-8",
            "sort_order": 8,
            "title": "Intern",
            "organization": "Oasis Infobyte",
            "start_date": "October 2023",
            "end_date": "November 2023",
            "location": "Remote",
            "description": "Virtual internship focusing on web development and technical problem solving.",
            "tags": "Internship, Web Development"
        }
    ],
    "education": [
        {
            "id": "edu-1",
            "sort_order": 1,
            "degree": "Master of Technology (MTech)",
            "field": "Computer Science Engineering (AI/ML)",
            "institution": "GIET University, Gunupur",
            "period": "September 2023 to May 2025",
            "location": "Gunupur, Odisha, India",
            "description": "Specialized postgraduate program focusing on advanced machine learning algorithms, deep learning architectures, data intelligence, and computer engineering."
        },
        {
            "id": "edu-2",
            "sort_order": 2,
            "degree": "Master of Computer Applications (MCA)",
            "field": "Computer and Information Sciences and Support Services",
            "institution": "Gandhi Institute of Engineering and Technology (GIET), Gunupur",
            "period": "July 2021 to May 2023",
            "location": "Gunupur, Odisha, India",
            "description": "Comprehensive masters curriculum in enterprise application architecture, database systems, and software engineering."
        },
        {
            "id": "edu-3",
            "sort_order": 3,
            "degree": "Bachelor's degree",
            "field": "Computer Software Engineering",
            "institution": "Berhampur University",
            "period": "August 2018 to July 2021",
            "location": "Berhampur, Odisha, India",
            "description": "Undergraduate degree establishing foundations in data structures, algorithms, programming paradigms, and software systems."
        }
    ],
    "skills": [
        {"id": "skill-1", "sort_order": 1, "name": "Research", "category": "Academic & Methodological"},
        {"id": "skill-2", "sort_order": 2, "name": "Image Processing", "category": "Technical Expertise"},
        {"id": "skill-3", "sort_order": 3, "name": "Healthcare", "category": "Domain Application"}
    ],
    "certifications": [
        {"id": "cert-1", "sort_order": 1, "title": "Machine Learning", "issuer": "", "issue_date": "", "credential_id": "", "credential_url": "", "description": ""},
        {"id": "cert-2", "sort_order": 2, "title": "Artificial Intelligence/Machine Learning", "issuer": "", "issue_date": "", "credential_id": "", "credential_url": "", "description": ""},
        {"id": "cert-3", "sort_order": 3, "title": "Web Development", "issuer": "", "issue_date": "", "credential_id": "", "credential_url": "", "description": ""},
        {"id": "cert-4", "sort_order": 4, "title": "Web Development and Designing", "issuer": "", "issue_date": "", "credential_id": "", "credential_url": "", "description": ""}
    ],
    "publications": [
        {
            "id": "pub-1",
            "sort_order": 1,
            "year": None,
            "publication_type": "Scholarly Paper",
            "title": "Predicting diabetic patients coronary artery calcium score, deep learning using retinal images.",
            "authors": "",
            "journal_or_book": "",
            "volume_issue": "",
            "pages": "",
            "doi": "",
            "url": "",
            "abstract": "",
            "tags": "Deep Learning, Retinal Images, Healthcare, Diabetes"
        },
        {
            "id": "pub-2",
            "sort_order": 2,
            "year": None,
            "publication_type": "Scholarly Paper",
            "title": "Combating food insecurity through remote sensing and machine learning for enhanced crop yield prediction.",
            "authors": "",
            "journal_or_book": "",
            "volume_issue": "",
            "pages": "",
            "doi": "",
            "url": "",
            "abstract": "",
            "tags": "Remote Sensing, Machine Learning, Agriculture, Crop Yield"
        },
        {
            "id": "pub-3",
            "sort_order": 3,
            "year": None,
            "publication_type": "Scholarly Paper",
            "title": "Effective Diabetes Mellitus Prediction Using a Hybrid Ensemble Machine Learning Model with IoT.",
            "authors": "",
            "journal_or_book": "",
            "volume_issue": "",
            "pages": "",
            "doi": "",
            "url": "",
            "abstract": "",
            "tags": "Hybrid Ensemble, Machine Learning, IoT, Healthcare"
        },
        {
            "id": "pub-4",
            "sort_order": 4,
            "year": None,
            "publication_type": "Scholarly Paper",
            "title": "Integrating Multi-Omics Data for Advanced Diabetes Prediction and Understanding.",
            "authors": "",
            "journal_or_book": "",
            "volume_issue": "",
            "pages": "",
            "doi": "",
            "url": "",
            "abstract": "",
            "tags": "Multi-Omics, Diabetes, Bioinformatics, Predictive Analytics"
        },
        {
            "id": "pub-5",
            "sort_order": 5,
            "year": None,
            "publication_type": "Scholarly Paper",
            "title": "Enhancing Diabetes Prediction using Hybrid Ensemble Approach.",
            "authors": "",
            "journal_or_book": "",
            "volume_issue": "",
            "pages": "",
            "doi": "",
            "url": "",
            "abstract": "",
            "tags": "Ensemble Learning, Diabetes Prediction, Machine Learning"
        }
    ],
    "research": [
        {
            "id": "res-1",
            "sort_order": 1,
            "title": "Machine Learning & Deep Learning",
            "icon": "fa-brain",
            "description": "Design and evaluation of deep neural network architectures and ensemble models for medical imaging, diagnostic predictive modeling, and remote sensing."
        },
        {
            "id": "res-2",
            "sort_order": 2,
            "title": "Artificial Intelligence in Healthcare",
            "icon": "fa-heart-pulse",
            "description": "Application of intelligent diagnostic systems, retinal image analysis for coronary artery calcification scoring, and multi-omics data integration for chronic disease prediction."
        }
    ]
}


def python_value_to_firestore(val):
    if val is None:
        return {"nullValue": None}
    elif isinstance(val, bool):
        return {"booleanValue": val}
    elif isinstance(val, int):
        return {"integerValue": str(val)}
    elif isinstance(val, float):
        return {"doubleValue": val}
    elif isinstance(val, str):
        return {"stringValue": val}
    elif isinstance(val, list):
        return {"arrayValue": {"values": [python_value_to_firestore(x) for x in val]}}
    elif isinstance(val, dict):
        return {"mapValue": {"fields": {k: python_value_to_firestore(v) for k, v in val.items()}}}
    return {"stringValue": str(val)}


def dict_to_firestore_doc(data_dict):
    fields = {}
    for k, v in data_dict.items():
        if k == "id":
            continue
        fields[k] = python_value_to_firestore(v)
    return {"fields": fields}


def authenticate_owner(email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    payload = json.dumps({
        "email": email,
        "password": password,
        "returnSecureToken": True
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["idToken"], data["localId"]
    except urllib.error.HTTPError as e:
        error_info = json.loads(e.read().decode("utf-8"))
        msg = error_info.get("error", {}).get("message", "Unknown error")
        raise RuntimeError(f"Authentication failed: {msg}")


def write_doc_to_firestore(collection_name, doc_id, data_dict, id_token):
    base_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{collection_name}/{doc_id}"
    body = json.dumps(dict_to_firestore_doc(data_dict)).encode("utf-8")

    req = urllib.request.Request(
        base_url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {id_token}"
        },
        method="PATCH"
    )

    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main():
    parser = argparse.ArgumentParser(description="Import verified portfolio data to Firestore")
    parser.add_argument("--email", help="Firebase Auth owner email")
    parser.add_argument("--password", help="Firebase Auth owner password")
    args = parser.parse_args()

    email = args.email
    password = args.password

    if not email:
        email = input("Enter owner email: ").strip()
    if not password:
        password = input("Enter owner password: ").strip()

    print(f"\n[1/3] Authenticating as {email}...")
    try:
        id_token, uid = authenticate_owner(email, password)
        print(f"[OK] Authentication successful! (UID: {uid})")
    except Exception as e:
        print(f"[ERROR] {e}")
        sys.exit(1)

    print("\n[2/3] Writing verified portfolio records to Firestore...")
    total_written = 0

    # 1. Profile
    print("  - Writing profile/main...")
    write_doc_to_firestore("profile", "main", PORTFOLIO_DATA["profile"], id_token)
    total_written += 1

    # 2. Experiences
    print(f"  - Writing {len(PORTFOLIO_DATA['experiences'])} experiences...")
    for exp in PORTFOLIO_DATA["experiences"]:
        write_doc_to_firestore("experiences", exp["id"], exp, id_token)
        total_written += 1

    # 3. Education
    print(f"  - Writing {len(PORTFOLIO_DATA['education'])} education records...")
    for edu in PORTFOLIO_DATA["education"]:
        write_doc_to_firestore("education", edu["id"], edu, id_token)
        total_written += 1

    # 4. Skills
    print(f"  - Writing {len(PORTFOLIO_DATA['skills'])} skills...")
    for skill in PORTFOLIO_DATA["skills"]:
        write_doc_to_firestore("skills", skill["id"], skill, id_token)
        total_written += 1

    # 5. Certifications
    print(f"  - Writing {len(PORTFOLIO_DATA['certifications'])} certifications...")
    for cert in PORTFOLIO_DATA["certifications"]:
        write_doc_to_firestore("certifications", cert["id"], cert, id_token)
        total_written += 1

    # 6. Publications
    print(f"  - Writing {len(PORTFOLIO_DATA['publications'])} publications...")
    for pub in PORTFOLIO_DATA["publications"]:
        write_doc_to_firestore("publications", pub["id"], pub, id_token)
        total_written += 1

    # 7. Research
    print(f"  - Writing {len(PORTFOLIO_DATA['research'])} research areas...")
    for res in PORTFOLIO_DATA["research"]:
        write_doc_to_firestore("research", res["id"], res, id_token)
        total_written += 1

    print("\n[3/3] Import Finished!")
    print(f"[OK] Successfully wrote {total_written} documents to Firestore database '{PROJECT_ID}'.")
    print("You can now open index.html or your Vercel site to see all data rendered dynamically!\n")


if __name__ == "__main__":
    main()
