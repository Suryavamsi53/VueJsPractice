const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const app = express();
const port = 3012; // Adjusted port number if needed

app.use(cors());
app.use(express.json());

// MSSQL configuration
const config = {
    server: 'localhost\\SQLEXPRESS', // Adjust server name if necessary
    database: 'VuejsApp',
    driver: 'msnodesqlv8',
    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
        integratedSecurity: true, // Use integrated security (Windows Authentication)
    },
};

// Connect to the database
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to MSSQL');
    }

    // CRUD operations for Lookup_table

    // GET all lookups
    app.get('/lookups', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Lookup_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new lookup
    app.post('/lookups', async (req, res) => {
        const { Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active } = req.body;
        try {
            const result = await pool.request()
                .input('Lookup_Code', sql.Int, Lookup_Code)
                .input('Lookup_Type', sql.VarChar(50), Lookup_Type)
                .input('Lookup_Desc', sql.VarChar(255), Lookup_Desc)
                .input('Is_Active', sql.Char(1), Is_Active)
                .query('INSERT INTO Lookup_table (Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active) VALUES (@Lookup_Code, @Lookup_Type, @Lookup_Desc, @Is_Active); SELECT SCOPE_IDENTITY() AS Lookup_Id;');
            const newLookupId = result.recordset[0].Lookup_Id;
            const newLookup = { Lookup_Id: newLookupId, Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active };
            res.status(201).send(newLookup);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // PUT (update) a lookup by ID
    app.put('/lookups/:id', async (req, res) => {
        const { id } = req.params;
        const { Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active } = req.body;
        try {
            await pool.request()
                .input('Lookup_Id', sql.Int, id)
                .input('Lookup_Code', sql.Int, Lookup_Code)
                .input('Lookup_Type', sql.VarChar(50), Lookup_Type)
                .input('Lookup_Desc', sql.VarChar(255), Lookup_Desc)
                .input('Is_Active', sql.Char(1), Is_Active)
                .query('UPDATE Lookup_table SET Lookup_Code = @Lookup_Code, Lookup_Type = @Lookup_Type, Lookup_Desc = @Lookup_Desc, Is_Active = @Is_Active WHERE Lookup_Id = @Lookup_Id');
            res.send('Lookup updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE a lookup by ID
    app.delete('/lookups/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('Lookup_Id', sql.Int, id)
                .query('DELETE FROM Lookup_table WHERE Lookup_Id = @Lookup_Id');
            res.send('Lookup deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Account_table

    // GET all accounts
    app.get('/accounts', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Account_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new account
    app.post('/accounts', async (req, res) => {
        const { AccountNumber, AccountStatus_id } = req.body;
        try {
            const result = await pool.request()
                .input('AccountNumber', sql.VarChar(20), AccountNumber)
                .input('AccountStatus_id', sql.Int, AccountStatus_id)
                .query('INSERT INTO Account_table (AccountNumber, AccountStatus_id) VALUES (@AccountNumber, @AccountStatus_id); SELECT SCOPE_IDENTITY() AS AccId;');
            const newAccountId = result.recordset[0].AccId;
            const newAccount = { AccId: newAccountId, AccountNumber, AccountStatus_id };
            res.status(201).send(newAccount);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // PUT (update) an account by ID
    app.put('/accounts/:id', async (req, res) => {
        const { id } = req.params;
        const { AccountNumber, AccountStatus_id } = req.body;
        try {
            await pool.request()
                .input('AccId', sql.Int, id)
                .input('AccountNumber', sql.VarChar(20), AccountNumber)
                .input('AccountStatus_id', sql.Int, AccountStatus_id)
                .query('UPDATE Account_table SET AccountNumber = @AccountNumber, AccountStatus_id = @AccountStatus_id WHERE AccId = @AccId');
            res.send('Account updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE an account by ID
    app.delete('/accounts/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('AccId', sql.Int, id)
                .query('DELETE FROM Account_table WHERE AccId = @AccId');
            res.send('Account deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Address_table

    // GET all addresses
    app.get('/addresses', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Address_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new address
    app.post('/addresses', async (req, res) => {
        const { AccountID, AddressTypeID, Address } = req.body;
        try {
            const result = await pool.request()
                .input('AccountID', sql.Int, AccountID)
                .input('AddressTypeID', sql.Int, AddressTypeID)
                .input('Address', sql.VarChar(255), Address)
                .query('INSERT INTO Address_table (AccountID, AddressTypeID, Address) VALUES (@AccountID, @AddressTypeID, @Address); SELECT SCOPE_IDENTITY() AS AddressID;');
            const newAddressId = result.recordset[0].AddressID;
            const newAddress = { AddressID: newAddressId, AccountID, AddressTypeID, Address };
            res.status(201).send(newAddress);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // PUT (update) an address by ID
    app.put('/addresses/:id', async (req, res) => {
        const { id } = req.params;
        const { AccountID, AddressTypeID, Address } = req.body;
        try {
            await pool.request()
                .input('AddressID', sql.Int, id)
                .input('AccountID', sql.Int, AccountID)
                .input('AddressTypeID', sql.Int, AddressTypeID)
                .input('Address', sql.VarChar(255), Address)
                .query('UPDATE Address_table SET AccountID = @AccountID, AddressTypeID = @AddressTypeID, Address = @Address WHERE AddressID = @AddressID');
            res.send('Address updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE an address by ID
    app.delete('/addresses/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('AddressID', sql.Int, id)
                .query('DELETE FROM Address_table WHERE AddressID = @AddressID');
            res.send('Address deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Account_holder_table

    // GET all account holders
    app.get('/account_holders', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Account_holder_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new account holder
    app.post('/account_holders', async (req, res) => {
        const { AccNum, AccTypeID, Acc_holders_N, AC_Balance, CD } = req.body;
        try {
            const result = await pool.request()
                .input('AccNum', sql.VarChar(50), AccNum)
                .input('AccTypeID', sql.Int, AccTypeID)
                .input('Acc_holders_N', sql.VarChar(255), Acc_holders_N)
                .input('AC_Balance', sql.Decimal(18, 2), AC_Balance)
                .input('CD', sql.Date, CD)
                .query('INSERT INTO Account_holder_table (AccNum, AccTypeID, Acc_holders_N, AC_Balance, CD) VALUES (@AccNum, @AccTypeID, @Acc_holders_N, @AC_Balance, @CD); SELECT SCOPE_IDENTITY() AS AccountHolderID;');
            const newAccountHolderId = result.recordset[0].AccountHolderID;
            const newAccountHolder = { AccountHolderID: newAccountHolderId, AccNum, AccTypeID, Acc_holders_N, AC_Balance, CD };
            res.status(201).send(newAccountHolder);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // PUT (update) an account holder by ID
    app.put('/account_holders/:id', async (req, res) => {
        const { id } = req.params;
        const { AccNum, AccTypeID, Acc_holders_N, AC_Balance, CD } = req.body;
        try {
            await pool.request()
                .input('AccountHolderID', sql.Int, id)
                .input('AccNum', sql.VarChar(50), AccNum)
                .input('AccTypeID', sql.Int, AccTypeID)
                .input('Acc_holders_N', sql.VarChar(255), Acc_holders_N)
                .input('AC_Balance', sql.Decimal(18, 2), AC_Balance)
                .input('CD', sql.Date, CD)
                .query('UPDATE Account_holder_table SET AccNum = @AccNum, AccTypeID = @AccTypeID, Acc_holders_N = @Acc_holders_N, AC_Balance = @AC_Balance, CD = @CD WHERE AccountHolderID = @AccountHolderID');
            res.send('Account holder updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE an account holder by ID
    app.delete('/account_holders/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('AccountHolderID', sql.Int, id)
                .query('DELETE FROM Account_holder_table WHERE AccountHolderID = @AccountHolderID');
            res.send('Account holder deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Transaction_table

    // GET all transactions
    app.get('/transactions', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Transaction_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new transaction
    app.post('/transactions', async (req, res) => {
        const { AccountID, TransAmount, TransTypeID, TransDate } = req.body;
        try {
            const result = await pool.request()
                .input('AccountID', sql.Int, AccountID)
                .input('TransAmount', sql.Decimal(18, 2), TransAmount)
                .input('TransTypeID', sql.Int, TransTypeID)
                .input('TransDate', sql.Date, TransDate)
                .query('INSERT INTO Transaction_table (AccountID, TransAmount, TransTypeID, TransDate) VALUES (@AccountID, @TransAmount, @TransTypeID, @TransDate); SELECT SCOPE_IDENTITY() AS TransactionID;');
            const newTransactionId = result.recordset[0].TransactionID;
            const newTransaction = { TransactionID: newTransactionId, AccountID, TransAmount, TransTypeID, TransDate };
            res.status(201).send(newTransaction);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // PUT (update) a transaction by ID
    app.put('/transactions/:id', async (req, res) => {
        const { id } = req.params;
        const { AccountID, TransAmount, TransTypeID, TransDate } = req.body;
        try {
            await pool.request()
                .input('TransactionID', sql.Int, id)
                .input('AccountID', sql.Int, AccountID)
                .input('TransAmount', sql.Decimal(18, 2), TransAmount)
                .input('TransTypeID', sql.Int, TransTypeID)
                .input('TransDate', sql.Date, TransDate)
                .query('UPDATE Transaction_table SET AccountID = @AccountID, TransAmount = @TransAmount, TransTypeID = @TransTypeID, TransDate = @TransDate WHERE TransactionID = @TransactionID');
            res.send('Transaction updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE a transaction by ID
    app.delete('/transactions/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('TransactionID', sql.Int, id)
                .query('DELETE FROM Transaction_table WHERE TransactionID = @TransactionID');
            res.send('Transaction deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
