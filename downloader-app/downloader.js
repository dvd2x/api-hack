"use strict";

// put your own value below!
const apiKey = "AIzaSyCGKrLxvpot6hrekFHQTPaCGeOFj92T3ao";
const searchURL = "https://www.googleapis.com/youtube/v3/search";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#download-results-list").empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++) {
    // for each video object in the items
    //array, add a list item to the results
    //list with the video title, description,
    //and thumbnail
    $("#download-results-list").append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

//downloader
async function downloadVideo(videoId) {
  console.log(videoId);
  const response = await fetch(`https://getvideo.p.rapidapi.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}`, {
    headers: {
      "X-RapidAPI-Host": "getvideo.p.rapidapi.com",
      "X-RapidAPI-Key": "d390d7b0e9msh42dc09f4e07e285p1486c4jsne0a4edb9e61e"
    }
  });
  const data = await response.json();
  return {
    audio: data.streams.filter(stream => {
      return stream.format === "audio only";
    })[0].url,
    video: data.streams.filter(stream => {
      return stream.format !== "audio only";
    })[0].url
  };
}

function getYouTubeVideos(query) {
  const params = {
    key: apiKey,
    q: query,
    part: "snippet"
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);

  fetch(url)
          .then(r => r.json())
          .then(data => {
            displayResults(data);
            return downloadVideo(data.items[0].id.videoId);
          })
          .then(download => console.log(download))
          .catch(err => {
            $("#js-error-message").text(`Something went wrong: ${err.message}`);
          });
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const downloadBtn = $("#js-dl-term").val();
    //const maxResults = $("#js-max-results").val();
    downloadVideo(downloadBtn, videoId);
  });
}

$(watchForm);

// ^^^^^^^^^^^^^^^ END YOUTUBE VIDEO SEARCH ^^^^^^^^^^^^^^^ //

// fetch(
//   "https://getvideo.p.rapidapi.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DnfWlot6h_JM",
//   {
//     headers: {
//       "X-RapidAPI-Host": "getvideo.p.rapidapi.com",
//       "X-RapidAPI-Key": "d390d7b0e9msh42dc09f4e07e285p1486c4jsne0a4edb9e61e"
//     }
//   }
// )
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     return {
//       audio: data.streams.filter(stream => {
//         return stream.format === "audio only";
//       })[0].url,
//       video: data.streams.filter(stream => {
//         return stream.format !== "audio only";
//       })[0].url
//     };
//   });

// $.getJSON(
//   "https://getvideo.p.rapidapi.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DnfWlot6h_JM",
//   function(data) {
//     console.log(data);
//   }
// );
