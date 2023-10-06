const  express = require('express')
const router = express.Router();


const db = require('../index');
router.get('/patients', (req, res) => {
    // Query the MySQL database to retrieve data
    db.query('SELECT * FROM patient', (error, results) => {
      if (error) {
        console.error('Error querying the database: ' + error.stack);
        res.status(500).send('Error fetching data from the database.');
        return;
      }

     
      
      // Render the "patients.ejs" template with the data
      res.render('patients', { title: 'Patients', data: results });
    });
  });
  // Render the Ward ejs
  router.get('/Ward', (req,res)=>{
    db.query('SELECT * FROM ward', (error, result1)=>{
      if (error){
        console.error("Error querying the database:" + error.stack);
        res.status(500).send("Error fetching data from the databse.");
        return;
      }
      res.render('Ward', {data2: result1});
    });
  });
    
  

// GET route to render the "add_user" page with the form
router.get('/add-patient', (req, res) => {
  res.render('add_user', { title: 'Add Users' });
});

// POST route to add a patient to the database
router.post('/add-patient', (req, res) => {
  // Get patient data from the request body (assuming you're using JSON)
  const {
    patient_id,
    name,
    initials,
    sex,
    date_of_birth,
    address,
    post_code,
    admission,
    ward_id,
    next_of_kin,
  } = req.body;

  const formatDateString = (dateStr) => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `20${year}-${month}-${day}`;
    }
    return null; // Invalid date format
  };

  const formattedAdmission = formatDateString(admission);

  if (!formattedAdmission) {
    res.status(400).json({ error: 'Invalid date format for admission' });
    return;
  }


  // Create an SQL query to insert the patient data into the database
  const sql = `
    INSERT INTO patient (
      patient_id,
      name,
      initials,
      sex,
      date_of_birth,
      address,
      post_code,
      admission,
      ward_id,
      next_of_kin
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the SQL query with the provided data
  db.query(
    sql,
    [
      patient_id,
      name,
      initials,
      sex,
      date_of_birth,
      address,
      post_code,
      admission,
      ward_id,
      next_of_kin,
    ],
    (error, result) => {
      if (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Error adding patient' });
        return;
      }

      // Successful insertion
      alert('Patient added successfully!');

      // Redirect back to the "add_user" page to enter more details
      res.redirect('/add-user');
    }
  );

  // Define the route to handle patient deletion
  
app.delete('/delete-patient/:patientId', (req, res) => {
  const patientId = req.params.patientId;

  // Create an SQL query to delete the patient by patient_id
  const deleteSql = 'DELETE FROM patient WHERE patient_id = ?';

  // Execute the SQL query with the provided patient ID
  db.query(deleteSql, [patientId], (error, result) => {
    if (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ error: 'Error deleting patient' });
      return;
    }

    if (result.affectedRows === 0) {
      // No patient with the given ID was found
      res.status(404).json({ error: 'Patient not found' });
    } else {
      // Patient deleted successfully
      res.status(200).json({ message: 'Patient deleted successfully' });
    }
  });
});


  
});





module.exports = router;

