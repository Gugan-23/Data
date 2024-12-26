import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  otp: string = ''; // Field for OTP input
  submittedData: { username: string; email: string; password: string } | null = null;
  otpSent: boolean = false; // Flag to check if OTP has been sent
  otpError: boolean = false; // Flag to indicate OTP verification error

  constructor(private http: HttpClient, private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // This method sends the signup data and requests OTP
  onSignup(signupForm: any) {
    if (signupForm.valid) {
      // Store submitted data
      this.submittedData = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      // Send signup data to the backend
      this.http.post('http://localhost:5000/api/signup1', this.submittedData)
        .subscribe({
          next: (response) => {
            console.log('Signup Data:', this.submittedData);
            console.log('Response from server:', response);
            this.otpSent = true; // OTP is sent, show OTP input field
          },
          error: (error) => {
            console.error('Error occurred while signing up:', error);
          }
        });
    } else {
      console.error('Form is invalid');
    }
  }

  // This method will verify the OTP entered by the user
  onVerifyOtp() {
    const otpData = {
      email: this.email,
      otp: this.otp,
    };

    // Send the OTP entered by the user for verification
    this.http.post('http://localhost:5000/api/verifyOtp', otpData)
      .subscribe({
        next: (response) => {
          console.log('OTP verified successfully:', response);
          // Proceed to the next step, such as logging in the user or redirecting
          this.router.navigate(['/dashboard']); // Example navigation
        },
        error: (error) => {
          console.error('Error verifying OTP:', error);
          this.otpError = true; // Set otpError to true if OTP verification fails
        }
      });
  }
}
