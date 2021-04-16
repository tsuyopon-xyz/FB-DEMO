const input = document.getElementById('username');
const submitButton = document.getElementById('btn');

// ユーザー取得周りの要素
const ulElement = document.getElementById('userList');
const fetchButton = document.getElementById('fetchButton');

const API_URL = 'http://localhost:5001/test-20210416/us-central1/helloWorld';
const API_URL_2 = 'http://localhost:5001/test-20210416/us-central1/getUsers';

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = input.value;
  console.log({ username });

  console.log('111111');
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
    }),
  });
  const json = await res.json();

  alert(json.message);
  input.value = '';
});

fetchButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const res = await fetch(API_URL_2);
  const json = await res.json();

  const users = json.users;

  console.log(users);

  while (ulElement.firstChild) {
    ulElement.removeChild(ulElement.firstChild);
  }
  users.forEach((user) => {
    const id = user.id;
    const username = user.username;

    const li = document.createElement('li');
    li.textContent = `ID: ${id}, username: ${username}`;
    ulElement.appendChild(li);
  });
});
