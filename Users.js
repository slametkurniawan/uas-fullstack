const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
        username: { type: String, unique: true },
        email: { type: String, unique: true },
        password: String
  },
  {
        collection: "Users"
  }
);

mongoose.model("Users", UserSchema);


const ScheduleSchema = new mongoose.Schema(
      {
        
        tgl: { type: Date },
        hari: {
          type: String,
          enum: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        },
        matkul: String,
        jam: String,
        ruangan: {
          type: String,
          enum: ['SISKOM LAB', 'INTRO LAB', 'NETWORK LAB', 'MOBILE LAB', 'Lainya'],
        },
      },
      {
        collection: "Schedules",
      }
    );

mongoose.model("Schedules", ScheduleSchema);

