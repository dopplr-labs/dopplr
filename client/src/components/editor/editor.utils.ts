import { BaseSettings, LineNumber, CursorBlinking } from 'types/settings'

export const settingsRemap = (textEditorSettings: BaseSettings): object => {
  return {
    lightbulb: { enabled: true },
    fontFamily: textEditorSettings.fontFamily as string,
    fontSize: textEditorSettings.fontSize as number,
    fontWeight: textEditorSettings.fontWeight as string,
    lineHeight: textEditorSettings.lineHeight as number,
    fontLigatures: textEditorSettings.fontLigatures as boolean,
    lineNumbers: textEditorSettings.lineNumbers as LineNumber,
    cursorBlinking: textEditorSettings.cursorBlinking as CursorBlinking,
    cursorSmoothCaretAnimation: textEditorSettings.textEditorSettings as boolean,
    glyphMargin: false,
    minimap: {
      enabled: false,
    },
    tabSize: 2,
    automaticLayout: true,
  }
}
