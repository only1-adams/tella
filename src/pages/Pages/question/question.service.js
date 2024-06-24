import { httpClient } from "../../../lib/axios";

export const api_getCourseSubjectChaptersTopic = async () => {
  return await httpClient
    .get("get_course_subject_chapters_topic/")
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_getSubjectChaptersTopic = async () => {
  return await httpClient
    .get("get_course_subject_chapters_topic/?get_subject_chapter_topic=true")
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_getQuestionBank = async (page_number, page_size) => {
  return await httpClient
    .get(`question_bank/?page_number=${page_number}&page_size=${page_size}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_searchQuestionBank = async (search, page_number, page_size) => {
  return await httpClient
    .get(`question_bank/?page_number=${page_number}&page_size=${page_size}&search=${search}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_addQuestionBank = async payload => {
  return await httpClient
    .post("question_bank/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_filterQuestionBank = async payload => {
  return await httpClient
    .post("question_bank/?filter=true", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_editQuestionBank = async payload => {
  return await httpClient
    .put("question_bank/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_deleteQuestionBank = async id => {
  return await httpClient
    .delete(`question_bank/?id=${id}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_getTopics = async (page_number, page_size) => {
  return await httpClient
    .get(`topic/?page_number=${page_number}&page_size=${page_size}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_deleteTopic = async id => {
  return await httpClient
    .delete(`topic/?topic_id=${id}`)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_addTopic = async payload => {
  return await httpClient
    .post("topic/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_editTopic = async payload => {
  return await httpClient
    .put("topic/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

export const api_getImage = async payload => {
  return await httpClient
    .post("image/", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};

export const api_getFilteredTopic = async payload => {
  return await httpClient
    .post("topic/?filter=true", payload)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
};
