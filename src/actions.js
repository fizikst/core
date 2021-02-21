async function fetchDadJoke(dispatch) {
  const response = await fetch("//icanhazdadjoke.com", {
    headers: {
      accept: "application/json"
    }
  });
  const data = await response.json();
  dispatch({
    type: "SET_DAD_JOKE",
    payload: data.joke
  });
}

export const actions = {
  fetchDadJoke
};
