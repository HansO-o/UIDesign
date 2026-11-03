export type Choice = { value: string; label: string; description?: string; disabled?: boolean };
export type SelectionProps = {
  options: readonly Choice[];
  value: string;
  onValueChange: (value: string) => void;
  /** Required accessible name for the group. */
  label: string;
  disabled?: boolean;
};
