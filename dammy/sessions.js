//definindummy g sessions to use like database
const ses =  [
    {
      sessionId:1,
      questions:"How to create github repository",
      mentorId: 1,
      menteeId: 2,
      menteeEmail: "niyomurengeziaphrodis@gmail.com",
      status:"pending"
    },
    {
      sessionId:2,
      questions:"How to clone github repository",
      mentorId: 3,
      menteeId: 1,
      menteeEmail: "uwayoreka@gmail.com",
      status:"accepted"
    },
    {
      sessionId:3,
      questions:"Which steps followed to push local file in github repository",
      mentorId: 1,
      menteeId: 4,
      menteeEmail: "umuzigara@gmail.com",
      status:"rejected"
    },
  ];
  
  export default ses; //for external use