import { useState, useEffect } from "react";
import "./App.css";

const CATEGORIES = ["еда", "быт", "другое"];

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("shopping-items");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("еда");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("shopping-items", JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newItem = {
      id: Date.now(),
      text: text.trim(),
      price: Number(price) || 0,
      category,
      done: false,
    };
    setItems([...items, newItem]);
    setText("");
    setPrice("");
  };

  const toggle = (id) =>
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const remove = (id) => setItems(items.filter((i) => i.id !== id));

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setItems(
        items.map((i) =>
          i.id === editingId ? { ...i, text: editText.trim() } : i
        )
      );
    }
    setEditingId(null);
  };

  const handleEditKey = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  const clearAll = () => {
    if (window.confirm("Очистить весь список?")) setItems([]);
  };

  const visible = items.filter((i) =>
    filter === "all" ? true : filter === "done" ? i.done : !i.done
  );
  const doneCount = items.filter((i) => i.done).length;
  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <div className="app">
      <h1>Список покупок</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Что купить?"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Цена"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit">Добавить</button>
      </form>

      <div className="filters">
        <button onClick={() => setFilter("all")}>Все</button>
        <button onClick={() => setFilter("active")}>Активные</button>
        <button onClick={() => setFilter("done")}>Выполненные</button>
      </div>

      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item.id)}
            />
            {editingId === item.id ? (
              <input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKey}
                onBlur={saveEdit}
              />
            ) : (
              <span
                className={item.done ? "done" : ""}
                onDoubleClick={() => startEdit(item)}
              >
                {item.text} — {item.category}, {item.price} ₽
              </span>
            )}
            <button onClick={() => remove(item.id)}>✕</button>
          </li>
        ))}
      </ul>

      <p>
        Осталось: {items.length - doneCount} | Куплено: {doneCount} | Сумма: {total} ₽
      </p>
      <button onClick={clearAll}>Очистить всё</button>
    </div>
  );
}
