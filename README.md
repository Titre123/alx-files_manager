# alx-files_manager

## Desciption
This is a project designed by ALX in order for her students to get familiar with redis and mongodb and express

## Content
### Question !
#### Objective: 
Create a working redis connection that is able to set and get keys
#### Code SneakPeak:
```
    connect() {
    return new Promise((resolve, reject) => {
      this.client.once('ready', () => {
        resolve();
      });

      this.client.once('error', (error) => {
        reject(error);
      });
    });
  }
```

## Credit
Taiwo Ola-Balogun 