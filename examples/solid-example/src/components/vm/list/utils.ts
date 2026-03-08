export function statusVariant(value: unknown): "default" | "secondary" | "success" | "warning" | "error" | "outline" {
  switch (value) {
    case "open":
    case "active":
      return "success";
    case "preparing":
      return "warning";
    case "closed":
    case "suspended":
      return "error";
    default:
      return "secondary";
  }
}

export function defaultActionHandler(basePath: string, navigate: (path: string) => void) {
  return (actionId: string, rowId?: string) => {
    switch (actionId) {
      case "create":
        navigate(`${basePath}/new`);
        break;
      case "show":
        if (rowId) navigate(`${basePath}/${rowId}`);
        break;
      case "edit":
        if (rowId) navigate(`${basePath}/${rowId}/edit`);
        break;
    }
  };
}
