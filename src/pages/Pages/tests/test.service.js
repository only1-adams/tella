import { httpClient } from "../../../lib/axios";

export const api_getTests = async (page_number, page_size) => {
  return await httpClient
    .get(`test/?page_number=${page_number}&page_size=${page_size}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_getDistinctValues = async () => {
  return await httpClient
    .get(`get_course_subject_chapters_topic/?get_subject_chapter_topic=true`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_getTestsSearch = async (page_number, page_size, search) => {
  return await httpClient
    .get(`test/?page_number=${page_number}&page_size=${page_size}&search=${search}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_getTestsById = async id => {
  return await httpClient
    .get(`test/?test_id=${id}&get_questions=true`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_addTest = async payload => {
  return await httpClient
    .post("test/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_test_conditions = async payload => {
  return await httpClient
    .post("test_condition/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_filterTest = async payload => {
  return await httpClient
    .post("test/?filter=true", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};
