export function generateUniqueRoomCode(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Define the character set (only uppercase letters)
  const codeLength = 8; // Length of the room code

  let roomCode = "";

  // Generate a random room code and check for uniqueness
  while (roomCode.length < codeLength) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomChar = alphabet[randomIndex];
    roomCode += randomChar;
  }

  return roomCode;
}
