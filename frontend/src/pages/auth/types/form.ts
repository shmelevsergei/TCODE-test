export interface IFormProps extends React.ComponentProps<"div"> {
  setForm: React.Dispatch<React.SetStateAction<"register" | "login">>
}
