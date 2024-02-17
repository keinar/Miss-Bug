import Axios from "axios";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = "//localhost:3030/api/bug/";

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getDefaultSort,
  getInitialSortValues
};

async function query(filterBy = {}, sortObj = {}) {
  const params = { ...filterBy, ...sortObj };
  const { data: bugs } = await axios.get(BASE_URL, { params })
  return bugs;
}

async function getById(bugId) {
  const url = BASE_URL + bugId;
  const { data: bug } = await axios.get(url);
  return bug;
}

async function remove(bugId) {
  const url = BASE_URL + bugId;
  const { data: res } = await axios.delete(url);
  return res;
}

async function save(bug) {
  const method = bug._id ? "put" : "post";
  const { data: savedBug } = await axios[method](BASE_URL, bug);
  return savedBug;
}

function getDefaultFilter() {
  return { txt: "", severity: "", pageIdx: 0 }
}

function getDefaultSort() {
  return {
    sortBy: 'createdAt',
    isAscending: false
  }
}

function getInitialSortValues() {
  return {
    createdAt: { key: 'createdAt', isAscending: true },
    severity: { key: 'severity', isAscending: true },
    title: { key: 'title', isAscending: false },
  }
}
