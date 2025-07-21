import { Key } from "@/frontend/types.ts";
import { StepData } from "@/frontend/types.ts";

export interface State {
  currentStepIndex: number;
  stepData: StepData;
  stepFlow: string[];
}

export type Action =
  | { type: "SET_STEP_DATA"; payload: Partial<StepData> }
  | { type: "SET_CURRENT_STEP_INDEX"; payload: number }
  | { type: "SET_STEP_FLOW"; payload: string[] }
  | { type: "RESET_STATE" };

export const initialState: State = {
  currentStepIndex: 0,
  stepData: {
    actionType: "",
    textManipulationType: "",
    builtinType: "",
    fileSystemType: "",
    scriptPath: "",
    websiteUrl: "",
    shortcutName: "",
    definedShortcut: { modifier: [Key.Ctrl, Key.Shift], key: Key.P },
    pasteText: "",
    applicationPath: "",
    filePath: "",
  },
  stepFlow: ['actionType'],
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP_DATA":
      return { ...state, stepData: { ...state.stepData, ...action.payload } };
    case "SET_CURRENT_STEP_INDEX":
      return { ...state, currentStepIndex: action.payload };
    case "SET_STEP_FLOW":
      return { ...state, stepFlow: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
} 