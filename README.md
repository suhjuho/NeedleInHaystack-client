<p align="center">
  <img width="400" alt="image" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/183ebf52-2a91-4e40-a381-c8ab5df22d7f">
</p>

<p align="center">
  Needle in haystack은 IT 키워드 검색시 자체 알고리즘 순위에 따라 영상을 검색해 주고 영상 속 코드 추출 기능도 제공하는 영상 기반의 검색엔진 서비스입니다.
</p>

<div align="center">

[Frontend repository](https://github.com/devsgk/NeedleInHaystack-client)
/
[Backend repository](https://github.com/devsgk/NeedleInHaystack-server)

</div>

## 📒 Contents
- [✈️ Demo](#️-demo)
- [🔧 Tech Stacks](#-tech-stacks)
- [🙋🏻‍♂️ Introduction](#️-introduction)
- [💪 Motivation](#-motivation)
- [🧐 How does a "Search Engine" work?](#-how-does-a-search-engine-work)
- [⛰️ Challenges](#️-challenges)
  1. [Search Algorithm](#1-search-algorithm)
  2. [Spell check feature](#2-spell-check-feature)
  3. [Extract code from playing video](#3-extract-code-from-playing-video)
  4. [Automate Crawler](#4-automate-crawler)
- [📚 What I learned](#-what-i-learned)
- [⏰ Project timeline](#-project-timeline)

<br>

## ✈️ Demo
To be updaed...

<br>

## 🔧 Tech Stacks

### Client
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

### Server
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### Test
![Static Badge](https://img.shields.io/badge/vitest-8A2BE2?style=for-the-badge)
![Testing-Library](https://img.shields.io/badge/React%20Testing%20Library-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)
![JestDOM](https://img.shields.io/badge/Jest%20DOM-8A2BE2?style=for-the-badge)

### Deployment
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)
![AWS](https://img.shields.io/badge/Elastic%20Beanstalk-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

<br>

## 🙋🏻‍♂️ Introduction

바닐라 코딩 부트캠프에서 4주간 진행한 팀 프로젝트로, 웹 개발 및 코딩 관련 영상을 YouTube처럼 검색해 주는 동영상 기반 검색 엔진 서비스를 구현해 보았습니다.

저희는 단순히 데이터를 가져오기 위해 YouTube에 API 요청을 하는 것이 아니라, 동영상 데이터를 직접 크롤링하여 고유한 방식으로 자체 데이터베이스에 저장하였습니다. 그리고 수집한 데이터를 기반으로 사용자의 검색어와 가장 유사한 비디오 데이터를 렌더링하는 검색 엔진을 구현하였습니다.

<br>

## 💪 Motivation
개발 공부를 하면서 구글링은 거의 필수적으로 사용되는 도구였습니다. 특히나 요즘에는 영상 콘텐츠의 폭발적인 증가와 함께 YouTube에서 정보를 찾는 것이 새로운 검색 표준이 되어 가고 있음을 느끼게 되었습니다. 이러한 변화에 영감을 받아, 개발 관련 주제로 한정하여 YouTube와 같은 효율적인 영상 검색 경험을 제공하는 서비스를 개발하고 싶다는  생각을 하게되었습니다. 그리고 일상 속에서 너무나도 당연하게 여겨졌던 “검색”에 대해 조금 더 깊이 알아가고 싶은 욕구가 생겨 Needle in haystack 프로젝트를 시작하게 되었습니다.

<br>

## 🧐 How does a "Search Engine" work?
Google과 같은 검색 엔진은 기본적으로 다음의 세 단계로 작동합니다.

**1. 크롤링**

: 크롤링은 검색 엔진이 새로운 웹 사이트나 문서를 찾으려고 시도하는 초기 단계입니다. 이 단계에서는 크롤러 또는 스파이더라고 알려진 자동화된 봇이 이 작업을 실행합니다. 이미 알고 있는 혹은 주어진 웹 페이지 URL에서 시작하여 해당 페이지에 존재하는 링크들을 따라간 다음, 연속적인 방식으로 다음 페이지에 있는 링크를 타고 갑니다. 이 프로세스를 통해 크롤러는 새로운 콘텐츠와 기존 콘텐츠를 찾아 긁어 오게 됩니다.

**2. 인덱싱**

: 크롤러가 스크랩한 새로운 콘텐츠는 인덱싱이라는 프로세스를 통해 데이터베이스에 저장됩니다. 인덱싱을 생성하는 동안 컨텐츠의 내용을 분석하게 되는데, 이 분석에는 콘텐츠를 설명하는 핵심 단어와 문구, 콘텐츠 유형을 기록하는 것이 포함될 수 있습니다. 이렇게 컨텐츠를 분석하여 데이터베이스에 저장함으로써, 유저로부터 검색 쿼리가 발생되면 가장 관련도가 높은 검색 결과를 렌더할 수 있게 됩니다.

**3. 검색 엔진**

: 마지막으로 여러가지 검색 알고리즘을 통해 유저의 쿼리와 가장 관련된 데이터를 렌더합니다. 알고리즘에는 TF-IDF, BM25, BM25F 및 PageRank와 같은 다양한 순위 알고리즘을 사용하여 각 콘텐츠가 쿼리와 얼마나 관련성이 있는지 평가하게 됩니다. 이를 통해 가장 관련성이 높은 데이터를 검색 결과 페이지 상단에 표시되도록 합니다.

저희는 Google의 Puppeteer 라이브러리를 사용하여 YouTube 동영상 데이터를 크롤링하였습니다. 그리고 긁어온 정보를 데이터베이스에 저장하기 전에 추후 사용자가 검색시 빠른 데이터 검색을 위해 데이터 전처리 및 역인덱싱을 수행하였습니다. 그리고 사용자의 검색 요청을 받으면 TF-IDF, BM25, BM25F, PageRank 등 다양한 순위 알고리즘을 사용하여 가장 관련성이 높은 데이터를 먼저 렌더링하도록 구현하였습니다.

<br>

## ⛰️ Challenges
### 1. Search Algorithm

: Our first challenge was implementing a search algorithm. The role of the search algorithm is incredibly important in a search engine for finding and displaying the results a user wants.

We researched various search algorithms and attempted to implement them ourselves. First, we applied the TF-IDF algorithm. Using the TF-IDF algorithm allows us to calculate the importance of a word within a document.

<br>

**- TF (Term Frequency)**
<p>
  <img width="350" alt="TF" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/393b05ae-9a9b-44fb-af44-70a49f37d5ec">
</p>

: It is the number of times a particular word appears in a document, divided by the total number of words in that document. This shows the frequency of the word. The more frequently a word appears, the higher its value.

<br>

**- IDF (Inverse Document Frequency)**
<p>
  <img width="350" alt="IDF" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/f3880913-56ff-454b-9129-0f94543b99d1">
</p>

: It is the logarithm of the total number of documents divided by the number of documents that contain the word. As the number of documents containing the word increases, the IDF value decreases inversely. This represents the uniqueness, or the specific value, of the word.

<br>

**- TF-IDF**
<p>
  <img width="350" alt="TF-IDF" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/6ab61630-e75e-4fd7-9f3d-87c109edad3e">
</p>

: TF-IDF is simply the product of these two values, meaning that the higher the frequency of the word in a specific document and the fewer appearances in other documents, the higher its TF-IDF value.

1. Spell check feature
2. Extract code from playing video
3. Automate crawler

<br>

**- BM25 (Best Matching 25)**
<p>
  <img width="350" alt="BM25" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/7c55a664-0f31-4f31-ad19-6eeaaa6beed0">
</p>

: We utilized a modified version of the TF-IDF algorithm, known as the BM25 algorithm.

Though the formula might appear complex at first glance, it similarly employs the IDF and TF values I just mentioned. However, two constants, k1 and b, are added, which respectively ensure the maximum value of frequency and the minimum value of document length.

Moreover, the algorithm includes the calculation of the document's length and the average length of all documents to perform normalization based on document length.

In our project, we employed BM25F which basically calculates the BM25 algorithm values for each field, such as title, description, and script within a video, assigning different weights according to the relative importance of each field.

<br>

**- PageRank algorithm**
<p>
  <img width="350" alt="Ranking" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/25ab70e7-534a-46db-8d57-a0af951e26b3">
</p>

Next, we added the PageRank algorithm to our search algorithm suite.

While the previously mentioned methods focus on the importance of words, the PageRank algorithm, true to its name, denotes the importance of pages.

Web pages contain links that point to each other, and the PageRank value of a page can be determined using the PageRank values of other pages that link to it.

The calculated PageRank value represents the probability of reaching that web page, and a higher PageRank value can indicate a webpage that many people are likely to visit.

<br>

### 2. Spell check feature

: When using search engines, you might have noticed that they can automatically correct misspelled search queries. We wanted to implement such a spell-check feature.

Before developing the spell check functionality, we looked into how Google performs spell checking.

Google analyzes user patterns. For example, a user might search for something using a misspelled word and, not finding the desired information, re-search with the correct spelling.

By analyzing these recurring patterns among many users, Google can identify the relationship between the misspelled words and the correct terms. Then, when another user makes the same spelling mistake, Google automatically searches using the correct term.

However, in our case, we didn’t have enough users and sufficient data to perform meaningful pattern analysis. Thus, we decided to adopt a different approach.

Our next challenge was this:

When using search engines, you might have noticed that they can automatically correct misspelled search queries. We wanted to implement such a spell-check feature.

Before developing the spell check functionality, we looked into how Google performs spell checking.

Google analyzes user patterns. For example, a user might search for something using a misspelled word and, not finding the desired information, re-search with the correct spelling.

By analyzing these recurring patterns among many users, Google can identify the relationship between the misspelled words and the correct terms. Then, when another user makes the same spelling mistake, Google automatically searches using the correct term.

However, we realized that our project faced a challenge due to a lack of users and insufficient data to perform meaningful pattern analysis. Thus, we decided to adopt a different approach.

We utilized the biGram and soundex algorithms.

Both algorithms function to check the similarity between two words.

- **Bigram and Soundex algorithm**

: It analyzes similarity by comparing the letters of words, while the Soundex algorithm compares the phonetics of words to assess similarity.

We recommended words with high similarity to the user's search query. To do this, we needed words to compare the search query against.

We collected these words during the crawling process. Every word was stored in the database during crawling, and when a user conducted a search, we found and suggested words with high similarity. However, we encountered two major issues in this process. 

1. Retrieving tens of thousands of words from the database took more time than expected.
2. Since the words were collected through crawling, some incorrect words were included.

To address these problems:

1. we improved accuracy by using an English word library filled with correct words.
2. We utilized a trie data structure to quickly determine if the user's search term was correct, applying the spelling check algorithm only in those cases.

These two methods helped us enhance both the speed and accuracy of our system.

<br>

### 3. Extract code from playing video
<p>
  <img width="350" alt="extract" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/19d22e2c-0c80-4819-9fd8-12d1252391b3">
</p>

: For this feature, we leveraged Optical Character Recognition (OCR) technology, which recognizes text in images, and we utilized Tesseract.js, the most widely used OCR engine in the Node.js environment. Initially, we thought extracting text from images would be challenging, but since the Tesseract OCR engine handles the extraction of text from images, we believed our task was simply to take screenshots of the playing video and let Tesseract recognize the text, which seemed feasible. Contrary to our expectations, we encountered more difficulties in taking screenshots than in extracting text.

Our first attempt was to directly access the video DOM element and then draw it on a canvas. The web allows direct access to DOM elements to capture their current state on a canvas. However, since we were embedding YouTube videos using an Iframe, we couldn't directly access the video DOM due to external resource access permission issues.

The solution we came up with was to use Puppeteer, as we did for crawling, to bypass and take screenshots directly from the actual YouTube webpage. Videos on the YouTube webpage are not in Iframe but in Video tags, making it possible to access the DOM. Utilizing this, we were able to take screenshots of the screen at the user's current video playback point based on two pieces of information: the video ID and the current playback time of the video the user was watching.

<br>

### 4. Automate Crawler
<p>
  <img width="350" alt="automate crawler" src="https://github.com/Team-Office360/NeedleInHaystack-client/assets/139360841/a529031c-6034-4c6a-bbb8-63439fcf2127">
</p>

- **First try**
: we hardcoded the entry URL when we wanted to crawl in **`crawl.js`** file, and manually execute this file from the terminal to start the crawling process. 

- **Second try**
For the second version, we implemented a admin page accessible only to administrators. This allowed us to input the entry URL via a text input field and control the crawler more dynamically through start and stop buttons on our website. 

- **Third try**

: To make the crawling process completely automatic, we deployed our crawler on AWS Lambda. By hosting the crawler on AWS Lambda, we could resolve the following two issues;

1. **Automation**: Unlike the previous versions that required manual on/off control, the last version of the crawler runs spontaneously at predetermined times. This allows us to focus on other development tasks without worrying about operating the crawler.
2. **Infinite Depth Crawling Problem**: The earlier crawler versions would run indefinitely until manually stopped, potentially straying off-topic from development-related videos to irrelevant content as time passed. Our service is designed to search for and watch development-related videos. By deploying the service on AWS Lambda, we adapted our strategy. Now, when a user navigates to a video watching page on our service, we store that video's ID. At specific times, the crawler accesses these stored video IDs and crawls only the top 5 related videos, avoiding the infinite depth issue. We also set a maximum function execution time to ensure the crawler stops automatically.

<br>

## 📚 What I learned
Working on this project was gave us a huge opportunity to deeply understand the principles behind the search engines we use daily. Real search engines utilize machine learning, AI, and manage much larger data sets, so we see endless challenges and opportunities for improvement in our project moving forward.

Among the achievable aspects, one area we're considering is how to further enhance search accuracy to deliver more personalized results to users. Storing users' search histories in the database has been our practice, but leveraging additional information like location and age could offer even more tailored results.

As for search speed, as we anticipate managing increasingly larger datasets, we're contemplating how to maintain quick search responses. This involves strategizing on data management and exploring ways to ensure that search speeds remain fast despite the growing volume of information.

Continual improvement and adaptation to these challenges are our key focuses, aiming to provide a search engine that not only meets but exceeds user expectations in terms of accuracy, speed, and personalized experience.

<br>

## ⏰ Project timeline
**2024.01.22 - 2024. 01.28**

- Brain storming for project ideas
- POC
- Planning
- KANBAN Task

**2024.01.29 - 2024.02.16**

- MERN stack environment setting
- Implement search engine
- Implement spell check feature
- Implement extract code feature
- Automate crawler

**2024.02.19 - 2024.02.25**

- README
- Deployment
