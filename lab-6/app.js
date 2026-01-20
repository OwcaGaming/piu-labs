const ajax = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
});

const btn1 = document.getElementById('fetchBtn');
const btn2 = document.getElementById('errorBtn');
const btn3 = document.getElementById('resetBtn');
const loadingDiv = document.getElementById('loader');
const list = document.getElementById('dataList');
const errorDiv = document.getElementById('errorMessage');

function showLoading() {
    loadingDiv.classList.remove('hidden');
    list.innerHTML = '';
    errorDiv.innerHTML = '';
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function showErrorMsg(msg) {
    hideLoading();
    errorDiv.innerHTML = '<strong>Błąd:</strong> ' + msg;
}

function showPosts(posts) {
    hideLoading();
    list.innerHTML = '';

    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let div = document.createElement('div');
        div.className = 'data-item';
        div.innerHTML =
            '<h3>' +
            post.title +
            '</h3>' +
            '<p>' +
            post.body +
            '</p>' +
            '<small>ID: ' +
            post.id +
            '</small>';
        list.appendChild(div);
    }
}

btn1.addEventListener('click', async function () {
    showLoading();
    try {
        const data = await ajax.get('/posts?_limit=5');
        showPosts(data);
    } catch (error) {
        showErrorMsg(error.message);
    }
});

btn2.addEventListener('click', async function () {
    showLoading();
    try {
        const data = await ajax.get('/posts/99999');
        showPosts(data);
    } catch (error) {
        showErrorMsg(error.message);
    }
});

btn3.addEventListener('click', function () {
    hideLoading();
    list.innerHTML = '';
    errorDiv.innerHTML = '';
});
