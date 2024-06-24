/**
 * Modifying array as the need of select
 * @param initial_array It takes array retrived from the api
 */
export const getAlteredData = array => {
  let modifiedList = array.map(e => {
    return {
      label: e.name === "" ? " " : e.name,
      value: e.id,
      id: e.id,
    };
  });
  return modifiedList;
};
