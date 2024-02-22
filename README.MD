# CrossRoadBot Documentation

CrossRoadBot is a Telegram bot designed to manage user registrations, admin requests, and provide information to users based on their roles. The bot offers various commands for both regular users and administrators.

## Access the Bot

You can access CrossRoadBot on Telegram by clicking on the following link: [crossroad_bot.t.me](https://t.me/crossroad_bot)
## Commands

### `/start`
- Description: Welcomes the user and provides information based on their role.
- Allowed Users: All users (Admins and Regular Users)

### `/register`
- **Description:** Registers the user as a Regular User.
- **Allowed Users:** Unregistered users

  *Note: Admins cannot use the `/register` command, and attempting to do so will result in a notification. If you are already registered as a Regular User, using this command again will also inform you that you are already registered.*



### `/unregister`
- Description: Unregisters the user. Admins cannot unregister.
- Allowed Users: Regular Users
  
  *Note: Admins cannot use the `/uregister` command, this is because if we allow admins to do so bot will be left without management. If you are  unregistered, using this command again is senseless, so it doesn't work that way.*

### `/myinfo`
- **Description:** Displays information about the user.
- **Allowed Users:** Regular Users

  *Command Format:* `/myinfo`

  *Result Format:*
```angular2html
  Your Info:
  Name: [User's First Name]
  ID: [User's Telegram ID]
  Username: @[User's Username]
  Role: Regular User
  Created At: [Formatted Date and Time]
```
*Note:* The result will provide details such as the `user's name`, `Telegram ID`, `username` (if available), `role` (Regular User), and the `date and time` of registration.


### `/listusers`
- **Description:** Lists all users (admins and regular users).
- **Allowed Users:** Admins

  - *Command Format:* `/listusers`

  - *Result Format:*
    ```
    List of Users and Admins
    *Admins*
    1. @[Admin1's Username or ID]: [Admin1's Registration Date]
    2. @[Admin2's Username or ID]: [Admin2's Registration Date]
    ...
    10. @[Admin10's Username or ID]: [Admin10's Registration Date]
    ...

    *Users*
    1. @[User1's Username or ID]: [User1's Registration Date]
    2. @[User2's Username or ID]: [User2's Registration Date]
    ...
    10. @[User10's Username or ID]: [User10's Registration Date]
    ```

  - *Note:* If the list is too large, a text file containing the full list will be sent to avoid issues with message length limitations. The file can be accessed by clicking the document link provided in the bot's response.

### `/adminregister`
- **Description:** Admins can see and manage admin requests. Regular users can submit admin requests.
- **Allowed Users:** Admins and Unregistered Users

  - *Command Format:* `/adminregister`

  - *Result Format:*
    - If the user is already an admin:
      ```
      You are already registered as an Admin!
      ```
    - If the user is a regular user and has a pending admin request:
      ```
      You already have a pending admin request submitted on [Request Date].
      You can cancel your request by using /cancel.
      ```
    - If the user is a regular user and does not have a pending admin request:
      ```
      Your request to become an admin has been submitted.
      You can cancel your request by using /cancel.
      ```
  - *Note:*
    - For a user to become an admin, they must be a registered regular user.
    - Admins can view and manage admin requests using this command.
    - Regular users can use this command to submit a request to become an admin. The request can be canceled using /cancel.
    - Admins can then use the /approve or /reject commands to manage the admin requests.


### `/cancel`
- Description: Cancels a pending admin request.
- Allowed Users: Regular Users

### `/approve`
- **Description:** Approves a pending admin request and notifies the user.
- **Allowed Users:** Admins

  - *Command Format:* `/approve [Telegram ID]`

  - *Example:* `/approve 123456789`

  - *Result Format:*
    - If the provided Telegram ID corresponds to a pending admin request:
      ```
      Admin request for user @[Username or ID] has been approved.
      A private message has been sent to notify the user.
      ```
    - If the provided Telegram ID is already an admin:
      ```
      No pending admin request found for the provided Telegram ID. 
      This user is an admin already.
      A private message has been sent to notify the user.
      ```
    - If the provided Telegram ID is a regular user:
      ```
      No pending admin request found for the provided Telegram ID. 
      This user is a regular user.
      A private message has been sent to notify the user.
      ```
    - If the provided Telegram ID is unregistered:
      ```
      No pending admin request found for the provided Telegram ID. 
      This user is unregistered yet.
      A private message has been sent to notify the user.
      ```
  - *Note:* The second parameter, [Telegram ID], is mandatory. Ensure it is included in the command to specify the user whose request is to be approved. The user will be notified with a direct message about the approval.

### `/reject`
- **Description:** Rejects a pending admin request and notifies the user.
- **Allowed Users:** Admins

  - *Command Format:* `/reject [Telegram ID]`

  - *Example:* `/reject 123456789`

  - *Result Format:*
    - If the provided Telegram ID corresponds to a pending admin request:
      ```
      Admin request for user @[Username or ID] has been rejected.
      A private message has been sent to notify the user.
      ```
    - If the provided Telegram ID is already an admin:
      ```
      No pending admin request found for the provided Telegram ID. 
      This user is an admin already.
      A private message has been sent to notify the user.
      ```
    - If the provided Telegram ID is a regular user:
      ```
      No pending admin request found for the provided Telegram ID. 
      This user is a regular user.
      A private message has been sent to notify the user.
      ```
    - If the provided Telegram ID is unregistered:
      ```
      No pending admin request found for the provided Telegram ID. 
      This user is unregistered yet.
      A private message has been sent to notify the user.
      ```
  - *Note:* The second parameter, [Telegram ID], is mandatory. Ensure it is included in the command to specify the user whose request is to be rejected. The user will be notified with a direct message about the rejection.


### Unknown Commands
- Description: Notifies the user if an unrecognized command is entered.

### Unsupported Message Types
- Description: Notifies the user if an unsupported message type is sent (e.g., photo, video, audio).

## Additional Information

- The bot processes text messages as commands. If an unrecognized command or plain text is entered, the user is notified.
- Certain message types (e.g., photo, video, audio) are currently not supported, and the user will be informed.
- Admins have specific commands for managing admin requests (`/adminregister`, `/approve`, `/reject`), while regular users have commands like `/register`, `/unregister`, `/myinfo`, and `/cancel`.


**Tech Stacks:**

1. **Sequelize:**
  
  - Simplifies database operations and models, allowing easy interaction with the SQLite database.

2. **SQLite3:**

  - Ideal for small to medium-sized applications, used for storing user, admin, and request data.

3. **Telegraf:**
  
  - Abstracts Telegram Bot API complexities, simplifies bot development, and handles commands and messages effectively.

4. **Telegram Bot API:**

  -  Manages interactions, sends messages, and handles user commands within the Telegram platform.

5. **Telegraf Session:**
  
  - Maintains user-specific data across messages, crucial for stateful interactions and tracking user actions.
