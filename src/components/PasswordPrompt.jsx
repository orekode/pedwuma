import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";


export default function FormDialog({ open, callback }) {

  const [ show, setShow ] = useState(false);
  const [ password, setPassword ] = useState("");

  const handleClose = () => {
    callback(password);
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Your Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide your password to complete this proccess
          </DialogContentText>
          <FormControl sx={{width: "100%", margin: "15rem 0"}}>
            <InputLabel htmlFor="outlined-adornment-amount" size="small">Password</InputLabel>
            <OutlinedInput

                id="outlined-adornment-amount"
                autoFocus
                margin="dense"
                size="small"
                label="Password"
                type={ show ? "text" : "password"}
                fullWidth
                variant="outlined"
                startAdornment={<InputAdornment position="start"><i className={`bi bi-shield-check`}></i></InputAdornment>}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                    <InputAdornment position="start">
                        <IconButton onClick={() => setShow(!show)}>
                            <i className={`bi bi-${!show ? 'eye-slash' : 'eye'}`}></i>
                        </IconButton>
                    </InputAdornment>
                }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}