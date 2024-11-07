import styled from "@emotion/styled";

export const AppWrapper = styled.div({
  textAlign: "center",
});

export const AppHeader = styled.header({
  backgroundColor: "#282c34",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "cyan",
});

export const SiteTitle = styled.code({
  fontSize: 40,
  fontWeight: 400,
  userSelect: "none",
});

export const CommandPromptWrapper = styled.div(
  ({ outputShown }: { outputShown: boolean }) => {
    const styles = {
      display: "flex",
      alignContent: "center",
      margin: "50px 0px",
    };
    if (outputShown) styles.margin = "50px 0 0 0";
    return styles;
  }
);

export const CommandPrompt = styled.input({
  display: "inline-block",
  background: "#282c34",
  color: "white",
  border: "none",
  outline: "none",
  width: 500,
  height: 46,
  fontSize: 30,
  "@media (max-width: 560px)": {
    width: "94%",
  },
});

export const CommandPromptPrefixWrapper = styled.div({
  display: "inline-block",
  color: "white",
  fontSize: 40,
});

export const ThingsToTryWrapper = styled.div({
  color: "white",
  border: "1px solid white",
  boxSizing: "border-box",
  textAlign: "left",
  padding: 15,
  fontSize: 16,
  width: 530,
  "@media (max-width: 560px)": {
    width: "94%",
  },
});

export const Error = styled.div({
  color: "red",
  textAlign: "left",
  width: 548,
  marginBottom: 30,
});

export const SuccessOutput = styled.div({
  color: "green",
  textAlign: "left",
  width: 548,
  marginBottom: 30,
});

export const AppLink = styled.a({
  color: "#61dafb",
});

export const SubmitButton = styled.button({
  background: "#282c34",
  border: "1px solid white",
  color: "white",
  borderRadius: "5px",
  fontSize: 18,
  cursor: "pointer",
  ":hover": {
    // outline: "2px solid white"
    boxShadow: "0 0 0 2px white",
  },
});

export const CommandsListWrapper = styled.div({ columns: 2, marginTop: 20 });
