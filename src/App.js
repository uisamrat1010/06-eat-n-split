import React from "react";
import { useState } from "react";
import Logo from "./logo-eatnsplit.png";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [addfriend, setAddfriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function HandleShowfriend() {
    setAddfriend((show) => !show);
    setSelectedFriend(null);
  }

  function HandleAddfriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setAddfriend(false);
  }

  function HandleShowSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setAddfriend(false);
  }
  function HandleSplitBill(value) {
    //console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <>
      <AppLogo />
      <div className="app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            onSelection={HandleShowSelection}
            selectedFriend={selectedFriend}
          />

          {addfriend && (
            <FormAddFriend onHandlefriendSubmit={HandleAddfriend} />
          )}

          <Button onClick={HandleShowfriend}>
            {!addfriend ? "Add Friend" : "close"}
          </Button>
        </div>

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={HandleSplitBill}
            key={selectedFriend.id}
          />
        )}
      </div>
    </>
  );
}

function AppLogo() {
  return <img src={Logo} alt="logo" className="logo" />;
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;

  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}₹
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}₹
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onHandlefriendSubmit }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function Handleaddsubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onHandlefriendSubmit(newFriend);

    //console.log(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={Handleaddsubmit}>
      <label>🧑Friend name </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidbyUser, setPaiduser] = useState("");
  const [paidbywho, setPaidbyWho] = useState("user");

  const friendExpense = bill ? bill - paidbyUser : "";

  function HandleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyUser) return;

    onSplitBill(paidbywho === "user" ? friendExpense : -paidbyUser);
  }

  return (
    <form className="form-split-bill" onSubmit={HandleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>

      <label>💵Bill amount</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧒Your expense</label>
      <input
        type="text"
        value={paidbyUser}
        onChange={(e) =>
          setPaiduser(
            Number(e.target.value) > bill ? paidbyUser : Number(e.target.value)
          )
        }
      />

      <label>👦{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>💰Who is paying the bill?</label>
      <select value={paidbywho} onChange={(e) => setPaidbyWho(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

export default App;
