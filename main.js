let news = [];
let page = 1;
let totalPages = 0;
let menus = document.querySelectorAll(".menus button");

menus.forEach((menu) =>
  menu.addEventListener("click", () => getNewsByTopic(event))
);
const searchForm = document.querySelector(".search form");
const searchFormInput = document.querySelector(".search form input");

searchForm.addEventListener("submit", () => getNewsBySearch(event));

let url;

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "ulpJx-BF_VupX-PGjyFesHT24jOu56exEBGzfYFaZCQ",
    });
    url.searchParams.set("page", page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();

    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다");
      }
      news = data.articles;
      totalPages = data.total_pages;
      page = data.page;
      render();
      pagenation();
      moveToPage(1);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.innerText.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );

  getNews();
};

const getNewsBySearch = async (event) => {
  event.preventDefault();
  let keyword = searchFormInput.value;
  searchFormInput.value = "";
  console.log(keyword);

  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&from=2023/9/1&countries=KR&page_size=10
    `
  );
  getNews();
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

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  pagenationHTML = `    <li class="page-item ${pageGroup == 1 ? "hidden" : ""}">
  <a class="page-link" href="#" aria-label="Previous" onclick = "moveToPage(1)">
    <span aria-hidden="true">&laquo;</span>
  </a>
</li>

<li class="page-item ${pageGroup == 1 ? "hidden" : ""}">
<a class="page-link" href="#" aria-label="Previous" onclick = "moveToPage(${
    page - 1
  })">
  <span aria-hidden="true">&lt;</span>
</a> </li>`;

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick = "moveToPage(${i})">${i}</a></li>`;
  }

  pagenationHTML += `    <li class="page-item ${
    pageGroup == Math.ceil(totalPages / 5) ? "hidden" : ""
  }">
  <a class="page-link" href="#" aria-label="Next" onclick = "moveToPage(${
    page + 1
  })">
    <span aria-hidden="true">&gt;</span>
  </a>
</li>

<li class="page-item ${pageGroup == Math.ceil(totalPages / 5) ? "hidden" : ""}">
<a class="page-link" href="#" aria-label="Next" onclick = "moveToPage(${totalPages})">
  <span aria-hidden="true">&raquo;</span>
</a>
</li>
`;

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

getLatestNews();
