/**
 * Modifying array as the need of select
 * @param initial_array It takes array retrived from the api
 */
export const getAlteredTestData = (array, pagination) => {
  let modifiedList = array.map((e, index) => {
    return {
      name: e.test === "" ? " " : e.test,
      value: e.id,
      id: ((pagination.pageIndex)*pagination.pageSize)+index+1,
      course: e.course
    };
  });
  return modifiedList;
};

/**
 * Modifying array as the need of select
 * @param initial_array It takes array retrived from the api
 */
export const getAlteredTest = array => {
  let modifiedList = array.map((e, index) => {
    return {
      label: e.test === "" ? " " : e.test,
      value: e.id,
      id: e.id,
    };
  });
  return modifiedList;
};
