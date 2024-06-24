export const hasPermission = permission => {
  let permissions = JSON.parse(localStorage.getItem("permissions"));
  if (permissions) {
    return permissions.includes(permission);
  } else {
    return false;
  }
};
