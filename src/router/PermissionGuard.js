const PermissionGuard = (WrappedComponent, requiredPermissions) => {
  // Replace 'userPermissions' with the actual name of the state/context where you store user permissions
  const permissions = JSON.parse(localStorage.getItem("permissions")); // Get the user's permissions from your state/context

  return () => {
    // Check if the user has all the required permissions
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      permissions.includes(permission)
    );

    if (hasRequiredPermissions) {
      return true;
    } else {
      // Redirect the user to a suitable page or show an access denied message
      return false;
    }
  };
};

export default PermissionGuard;
