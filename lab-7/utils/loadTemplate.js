export default async function loadTemplate(url) {
    const template = document.createElement('template');
    const response = await fetch(url);
    const html = await response.text();
    template.innerHTML = html;
    return template;
}
