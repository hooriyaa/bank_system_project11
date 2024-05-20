#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
//customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNUmber;
    accNumber;
    constructor(fname, lname, age, gender, mobNumber, accNumber) {
        this.firstName = fname;
        this.lastName = lname;
        this.age = age;
        this.gender = gender;
        this.mobNUmber = mobNumber;
        this.accNumber = accNumber;
    }
}
//class bank
class bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transection(accObj) {
        let newAccounts = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...newAccounts, accObj];
    }
}
let myBank = new bank();
//Customer create
for (let i = 1; i <= 5; i++) {
    let fname = faker.person.firstName("female");
    let lname = faker.person.lastName();
    let num = parseInt(faker.string.numeric("3##########"));
    const cus = new Customer(fname, lname, 14 * i, "female", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 1000 * i });
}
console.log("\t", "-".repeat(70), "\t");
console.log(chalk.bold.magenta("\t\tWelcome To My Typescript Project - 'BANK SYSTEM'\t\t"));
console.log("\t", "-".repeat(70), "\t");
//bank functionality
async function bankService(bank) {
    do {
        let services = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Please select the service:",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });
        // View Balance
        if (services.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your account number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.yellow.italic("Invalid Account Number..."));
            }
            else if (account) {
                let name = myBank.customer.find((item) => item.accNumber === account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your account balance is ${chalk.bold.blueBright(account.balance)}`);
            }
        }
        //Cash Withdraw
        else if (services.select === "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your account number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.red.italic(chalk.bold.yellow("Invalid Account Number...")));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    name: "rupee",
                    type: "number",
                    message: "Please Enter your account.",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.bold.green.magenta("Insufficient Balance !!!"));
                }
                let newBalance = account.balance - ans.rupee;
                //transection method
                bank.transection({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //Cash Deposit
        else if (services.select === "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your account number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.bold.yellow.italic("Invalid Account Number..."));
            }
            else if (account) {
                let ans = await inquirer.prompt({
                    name: "rupee",
                    type: "number",
                    message: "Please Enter your account.",
                });
                let newBalance = account.balance + ans.rupee;
                //transection method
                bank.transection({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        else if (services.select === "Exit") {
            console.log(chalk.red.bold.italic("Exiting the program...."));
            process.exit();
        }
    } while (true);
}
bankService(myBank);
