import { useEffect, useReducer, useRef, useState } from "react";
import "./styles.css";
const obj = {
  ADDTODO: "add todo",
  DELETETODO: "delete",
  UPDATETODO: "update",
  RESETTODO: "reset",
  SETITEMS: "set"
};
const reducer = (state, action) => {
  switch (action.type) {
    case obj.ADDTODO:
      return [...state, action.value];
    case obj.DELETETODO:
      return state.filter(val => val.id !== action.id);

    case obj.UPDATETODO:
      console.log("update in progress");
      return state.map(val => {
        if (val.id === action.id) {
          return { ...val, completed: !val.completed };
        } else {
          return val;
        }
      });
    case obj.SETITEMS:
      let items = JSON.parse(localStorage.getItem("todo")) || [];
      return items.length > 0 ? items : [];
    default:
      return state;
  }
};
const App = () => {
  const [todo, dispatch] = useReducer(reducer, []);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    localStorage.setItem("todo", JSON.stringify(todo));
  });
  useEffect(() => {
    dispatch({ type: obj.SETITEMS });
  }, []);

  const todoRef = useRef();
  const addTodo = () => {
    const { value } = todoRef.current;
    value &&
      dispatch({
        type: obj.ADDTODO,
        value: {
          name: value,
          completed: false,
          id: new Date().getMilliseconds()
        }
      });
    todoRef.current.value = "";
  };
  const deleteTodo = id => {
    id && dispatch({ type: obj.DELETETODO, id });
  };
  const handleKeyDown = e => {
    e.ctrlKey && e.key === "y" && todoRef.current.focus();
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="box">
      <div className="input-wrapper">
        <input
          ref={todoRef}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          autoFocus
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div className="item-wrapper">
        {todo.map((val, index) => {
          return (
            <div
              className="todo-box"
              onClick={() => dispatch({ type: obj.UPDATETODO, id: val.id })}
              key={val.id || index}
            >
              <span
                className="close"
                onClick={e => {
                  e.stopPropagation();
                  deleteTodo(val.id);
                }}
              >
                x
              </span>

              <span className={`title ${val.completed && "red"}`}>
                {val.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
