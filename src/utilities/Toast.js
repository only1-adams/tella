import { showNotification } from "@mantine/notifications";
import { IconCircleCheck, IconExclamationCircle } from "@tabler/icons";

/**
 * Shows success notification toast
 * @param props Object with "title" and "message"
 */

export function showSuccessToast(props) {
  showNotification({
    title: props.title,
    message: props.message,
    icon: <IconCircleCheck size={28} color="white" />,
    position: "top",
    color: "teal",
    disallowClose: true,
    styles: theme => ({
      root: {
        width: "450px",
        backgroundColor: theme.colors.green[2],
        borderColor: theme.colors.green[8],
        borderWidth: 2,
        "&::before": { backgroundColor: theme.white },
      },
      title: { color: theme.colors.green[10], fontWeight: 600, fontSize: 16 },
      description: { color: theme.colors.dark[4] },
      closeButton: {
        color: theme.white,
        "&:hover": { backgroundColor: theme.colors.green[7] },
      },
    }),
  });
}

/**
 * Shows error notification toast
 * @param props Object with "title" and "message"
 */
export function showErrorToast(props) {
  showNotification({
    title: props.title,
    message: props.message,
    icon: <IconExclamationCircle size={28} color="white" />,
    position: "top",
    color: "red",
    disallowClose: true,
    styles: theme => ({
      root: {
        width: "450px",
        backgroundColor: theme.colors.red[2],
        borderColor: theme.colors.red[2],
        borderWidth: 2,
        "&::before": { backgroundColor: theme.white },
      },
      title: { color: theme.colors.red[10], fontWeight: 600, fontSize: 16 },
      description: { color: theme.colors.dark[4] },
      closeButton: {
        color: theme.white,
        "&:hover": { backgroundColor: theme.colors.red[7] },
      },
    }),
  });
}
