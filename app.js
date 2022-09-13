
const express = require('express');
const { Pool, Client } = require('pg');
require('dotenv').config();

const auth = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
};
const pool = new Pool(auth);
const client = new Client(auth);
const app = express();
app.use(express.json());

app.get('/', function (request, response) {
    response.status(200).json({});
});

/**
 * Retrieve all of the products
 */
app.get('/products', function (request, response) {
    pool.query('SELECT * FROM products', (error, results) => {
        response.status(200).json(results.rows);
    });
});


/**
 * Add a new product
 */
app.post('/products' , (request , response)=>{

    var status = '';
    try {
        pool.query(
            "INSERT INTO products (name, category_id, description) VALUES($1, $2, $3)", 
            [request.body.name, request.body.category_id, request.body.description]
        );
        status = 'success';
    } catch (error) {
        status = 'error';
    }
    response.status(200).json({
        'status': status,
    });
})


/**
 * Delete the single product by id parameter
 */
app.delete('/products', (request, response) => {

    try {
        pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [request.body.id], (error, results) => 
        {
            if( results.rowCount > 0 )
            {
                pool.query('DELETE FROM products WHERE id = $1', [request.body.id], (error, results) => 
                {
                    if( results.rowCount > 0 )
                    {
                        response.status(200).json({
                            'status': 'success',
                        });  
                    }
                    else
                    {
                        response.status(200).json({
                            'status': 'not_found',
                        });   
                    }
                });
            }
            else
            {
                response.status(200).json({
                    'status': 'not_found',
                });   
            }
        });
    } catch (error) {
        console.log( error.status );
    }



    // if( query.rows )
    // {
    //     pool.query('DELETE FROM products WHERE id = $1', [request.body.id]);
    //     response.status(200).json({
    //         'status': 'success',
    //     });
    // }
    // else
    // {
    //     response.status(404).json({
    //         'status': 'not_found',
    //     });
    // }
});


app.listen(3000, function () {
    console.log('Server is running.');
});