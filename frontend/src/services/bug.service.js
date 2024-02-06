import Axios from "axios";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = "//localhost:3030/api/bug/";

export const bugService = {
  query,
  get,
  save,
  remove,
};

async function query() {
  var { data: bugs } = await axios.get(BASE_URL);
  return bugs;
}

async function get(bugId) {
  const url = BASE_URL + bugId;
  var { data: bug } = await axios.get(url);
  return bug;
}

async function remove(bugId) {
  const url = BASE_URL + bugId + "/remove";
  var { data: res } = await axios.get(url);
  return res;
}

async function save(bug) {
  const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&description=${
    bug.description
  }&severity=${bug.severity}&createdAt=${bug.createdAt}`;
  const url = BASE_URL + "save" + queryParams;

  const { data: savedBug } = await axios.get(url);
  return savedBug;
}
