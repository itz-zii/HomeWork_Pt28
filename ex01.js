
//Make HTTP Request
// - XHR
// - Fetch

//fetch(url, options): Trả về promise
const baseUrl = "http://localhost:3000"
// fetch(`${baseUrl}/users`).then((response) => {
    // return response.json();
    // return response.text();
// })
// .then((data) => {
    // const users = JSON.parse(data);
    // console.log(user);
    // console.log(data);    // 
// })

// const getUsers = async () => {
//     try {
//         const response = await fetch(`${baseUrl}/users/1`);
//         if (!response.ok) {
//             throw new Error("Fetch to failed");
//         }
//         const data = await response.json();
//         console.log(data);
//     }   catch (error) {
//         console.log(error);
        
//     }
// };
// getUsers();

const createUser = async (data) => {
    const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const user = await response.json();
    console.log(data);
};

createUser({
    name: "Zion",
    email: "tuancl12345678@gmail.com"
})