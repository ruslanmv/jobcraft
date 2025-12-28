from __future__ import annotations
from pathlib import Path
import fitz  # PyMuPDF
from docx import Document

def parse_cv(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == '.pdf':
        doc = fitz.open(str(path))
        text = []
        for page in doc:
            text.append(page.get_text())
        return '\n'.join(text).strip()
    if suffix in ('.docx',):
        d = Document(str(path))
        return '\n'.join(p.text for p in d.paragraphs).strip()
    return path.read_text(encoding='utf-8', errors='ignore').strip()
