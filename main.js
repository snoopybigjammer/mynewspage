let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", () => getNewsByTopic(event))
);
const searchForm = document.querySelector(".search form");
const searchFormInput = document.querySelector(".search form input");

searchForm.addEventListener("submit", () => getNewsBySearch(event));

const getLatestNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  let header = new Headers({
    "x-api-key": "ulpJx-BF_VupX-PGjyFesHT24jOu56exEBGzfYFaZCQ",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();

  news = data.articles;

  render();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.innerText.toLowerCase();
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );

  header = new Headers({
    "x-api-key": "ulpJx-BF_VupX-PGjyFesHT24jOu56exEBGzfYFaZCQ",
  });

  let response = await fetch(url, { headers: header });
  let data = await response.json();

  news = data.articles;

  render();
};

const getNewsBySearch = async (event) => {
  event.preventDefault();
  let keyword = searchFormInput.value;
  searchFormInput.value = "";
  console.log(keyword);

  let url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&from=2023/9/1&countries=KR&page_size=10
    `
  );

  header = new Headers({
    "x-api-key": "ulpJx-BF_VupX-PGjyFesHT24jOu56exEBGzfYFaZCQ",
  });

  let response = await fetch(url, { headers: header });
  let data = await response.json();

  news = data.articles;

  render();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((news) => {
      return `
    <div class="row news">
          <div class="col-lg-4">
            <img
              class="news_img"
              src="${
                news.media ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
              }"
              alt=""
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${
              news.summary == null || news.summary == ""
                ? "내용 없음"
                : news.summary.length > 200
                ? news.summary.substring(0, 200) + "..."
                : news.summary
            }</p>
            <div>${news.rights || "no source"} / ${moment(
        news.published_date
      ).format("MMM Do YY")}</div>
          </div>
        </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatestNews();
