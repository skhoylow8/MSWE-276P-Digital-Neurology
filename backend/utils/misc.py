import fitz  # PyMuPDF for handling PDF files


def convert_pdf_to_text(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def convert_txt_to_text(file_path):
    with open(file_path, 'r') as file:
        text = file.read()
    return text


def convert_file_to_text(file_path):
    # Determine file type based on extension
    file_extension = file_path.split('.')[-1].lower()
    if file_extension == 'pdf':
        return convert_pdf_to_text(file_path)
    elif file_extension == 'txt':
        return convert_txt_to_text(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_extension}")
