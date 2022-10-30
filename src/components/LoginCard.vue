<template>
  <div style="display: contents">
    <v-card class="elevation-2" min-width="360px" max-width="460px">
      <v-toolbar color="grey lighten-2" flat>
        <v-toolbar-title>
          {{ isSigningUp ? "Sign Up" : "Log In" }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn text @click="toggleForm">
          {{ isSigningUp ? "Log In" : "Sign Up" }}
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            ref="email"
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="Email"
            type="email"
            outlined
          />
          <v-text-field
            ref="password"
            v-model="password"
            :rules="
              isSigningUp ? [rules.required, rules.password] : [rules.required]
            "
            label="Password"
            type="password"
            outlined
            v-on:keydown="clickLoginBtn"
          />
          <v-text-field
            v-if="isSigningUp"
            ref="password-confirm"
            v-model="passwordConfirm"
            :rules="[rules.required, rules.confirmPassword]"
            label="Confirm Password"
            type="password"
            outlined
            v-on:keydown="clickSignupBtn"
          ></v-text-field>
        </v-form>
        <v-btn
          ref="forgotPassBtn"
          class="grey--text"
          text
          v-on:click="forgetPasswordHandler"
        >
          Forgot Password?
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          ref="actionBtn"
          class="mb-2 white--text"
          depressed
          block
          large
          v-bind="btnOptions"
          v-on:click="doAuthAction"
        >
          {{ btnMessage }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
    <error-dialog ref="refAuthErrorDialog"></error-dialog>
    <input-dialog ref="refAuthInputDialog">
      <template v-slot:left-card-actions>
        <v-btn
          v-if="resendCodeThrottleCounter === 0"
          color="green lighten-1"
          text
          @click="resendCode()"
        >
          Resend
        </v-btn>
        <v-progress-circular
          v-else
          :indeterminate="resendCodeThrottleCounter === -1"
          :rotate="-90"
          :size="24"
          :value="resendCodeProgressValue"
          :width="3"
          color="orange"
        />
      </template>
    </input-dialog>
    <input-dialog ref="refPasswordResetDialog"> </input-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import ErrorDialog from "./ErrorDialog.vue";
import InputDialog from "./InputDialog.vue";

export default {
  components: { ErrorDialog, InputDialog },
  data() {
    return {
      isSigningUp: false,
      resendCodeThrottleCounter: 0,

      email: "",
      password: "",
      passwordConfirm: "",

      btnEnabled: true,
      btnIsLoading: false,
      btnDefaultColor: "red",
      btnErrorMessage: "",

      rules: {
        required: (value) => !!value || "Value Required",
        email: (value) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          ) || "Must be a valid email address",
        password: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=])[A-Za-z\d^$*.[\]{}()?\-"!@#%&/\\,><':;|_~`+=]{8,}$/.test(
            value
          ) ||
          "Must have at least 8 characters including at least 1 number, 1 special character, 1 lowercase letter and 1 uppercase letter",
        confirmPassword: (value) =>
          value === this.password || "Passwords don't match",
      },
    };
  },
  computed: {
    btnColor: {
      get() {
        return this.btnErrorMessage === "" ? this.btnDefaultColor : "error";
      },
    },
    btnMessage: {
      get() {
        if (this.btnErrorMessage === "") {
          return this.isSigningUp ? "Sign Up" : "Log In";
        } else {
          return this.btnErrorMessage;
        }
      },
      set(value) {
        this.btnErrorMessage = value;
        setTimeout(() => {
          this.btnErrorMessage = "";
        }, 5000);
      },
    },
    btnOptions() {
      const options = {
        loading: this.btnIsLoading,
        disabled: !this.btnEnabled,
        color: this.btnColor,
        outlined: this.btnColor === this.btnDefaultColor,
      };
      return options;
    },
    resendCodeThrottleTimeout() {
      // TODO: gradually increase timeout value on each invocation
      return 30;
    },
    resendCodeProgressValue() {
      return (
        (100 * this.resendCodeThrottleCounter) / this.resendCodeThrottleTimeout
      );
    },

    // map vuex getters
    ...mapGetters([]),
  },
  mounted: function () {
    //
  },
  methods: {
    toggleForm() {
      this.isSigningUp = !this.isSigningUp;
    },
    doAuthAction() {
      if (!this.isSigningUp && this.email && this.password) {
        this.btnIsLoading = true;

        let payload = {
          authData: {
            email: this.email,
            password: this.password,
          },
          successCallback: () => {
            this.btnIsLoading = false;
            this.email = this.password = "";
            this.$emit("closeLoginDialog");
          },
          errorCallback: (error) => {
            if (error.code === "UserNotConfirmedException") {
              this.$refs.refAuthInputDialog
                .open({
                  title: "Confirm your email",
                  label: "Verification Code",
                  hint: "Enter the code sent to your email address here",
                })
                .then((result) => {
                  if (result) {
                    this.btnIsLoading = true;
                    this.confirmRegistration({
                      code: result,
                      resultCallback: (error) => {
                        if (error) {
                          this.$refs.refAuthErrorDialog.open({
                            errorTitle: "Failed to confirm your email!",
                            errorMsg: `Reason: ${error.message}`,
                          });
                          this.btnIsLoading = false;
                        } else {
                          this.btnIsLoading = false;
                          this.doAuthAction();
                        }
                      },
                    });
                  }
                });
            } else if (error.code === "PasswordResetRequiredException") {
              this.$refs.refAuthErrorDialog.open({
                errorTitle: "Password reset required!",
                errorMsg: "",
              });
              this.$refs.refAuthInputDialog.open({
                title: "Reset your password",
                label: "Password Reset Code",
                hint: "Enter the code sent to your email address here",
              });
            } else if (error.code === "ResourceNotFoundException") {
              this.$refs.refAuthErrorDialog
                .open({
                  errorTitle: "Oops! We messed up",
                  errorMsg:
                    "Seems like an app error has occured, which is likely our fault. Please contact the administrator and let them know so that we can fix it asap",
                })
                .then(() => {
                  this.$emit("closeLoginDialog");
                });
            } else {
              this.$refs.refAuthErrorDialog.open({
                errorTitle: "Failed to log you in!",
                errorMsg: `Reason: ${error.message}`,
              });
            }
            this.btnIsLoading = false;
          },
        };

        this.authenticateUser(payload);
      } else if (
        this.isSigningUp &&
        this.email &&
        this.password &&
        this.passwordConfirm
      ) {
        this.btnIsLoading = true;

        this.signUp({
          email: this.email,
          password: this.password,
          resultCallback: (err) => {
            if (err) {
              this.$refs.refAuthErrorDialog.open({
                errorTitle: "Your Signup Request Failed!",
                errorMsg: `Reason: ${err.message}`,
                actionable: false,
              });
            } else {
              this.isSigningUp = false;
              this.doAuthAction();
            }
            this.btnIsLoading = false;
          },
        });
      } else {
        let fields = ["email", "password"];
        if (this.isSigningUp) fields.push("password-confirm");
        fields.forEach((value) => {
          this.$refs[value].validate(true);
        });
      }
    },
    clickLoginBtn(keyevent) {
      if (!this.isSigningUp && keyevent.key === "Enter") {
        this.$refs.actionBtn.$el.click();
      }
    },
    clickSignupBtn(keyevent) {
      if (this.isSigningUp && keyevent.key === "Enter") {
        this.$refs.actionBtn.$el.click();
      }
    },
    resendCode() {
      if (this.resendCodeThrottleCounter !== 0) {
        throw new Error(
          "Invalid State: Resend code button should not be visible now"
        );
      }

      // place the resend button into a loading state immediately
      this.resendCodeThrottleCounter = -1;
      this.resendConfirmationCode((err) => {
        // we're not receiving `result` in parameter since we don't need it
        if (err) {
          this.resendCodeThrottleTimeout = 0;
          this.$refs.refAuthErrorDialog.open({
            errorTitle: "Request to Resend Confirmation Code Failed!",
            errorMsg: `Reason: ${err.message}`,
            actionable: false,
          });
        } else {
          this.resendCodeThrottleCounter = this.resendCodeThrottleTimeout;
          const f = () => {
            if (this.resendCodeThrottleCounter > 0) {
              this.resendCodeThrottleCounter -= 1;
              setTimeout(f, 1000);
            }
          };
          setTimeout(f, 1000);
        }
      });
    },

    forgetPasswordHandler: function () {
      this.$refs.refPasswordResetDialog
        .open({
          title: "Reset your password",
          label: "Email Address",
          hint: "Enter the email address used to register the account",
          type: "email",
        })
        .then((email) => {
          const successCallback = () => {
            this.$refs.refPasswordResetDialog
              .open({
                title: "Reset your password",
                label: "Password Reset Code",
                hint: "Enter the code that was sent to your email",
              })
              .then((code) => {
                this.$refs.refPasswordResetDialog
                  .open({
                    title: "Reset your password",
                    label: "New Password",
                    hint: "Enter the new password you want to set",
                    type: "password",
                  })
                  .then((newPassword) => {
                    this.confirmPassword({
                      email: email,
                      code: code,
                      newPassword: newPassword,
                      successCallback: () => {
                        alert("Successfully reset password. Please login.");
                      },
                      errorCallback: (err) => {
                        this.$refs.refAuthErrorDialog.open({
                          errorTitle: "Failed to set new password!",
                          errorMsg: `Reason: ${err.message}`,
                          actionable: false,
                        });
                      },
                    });
                  });
              });
          };
          const errorCallback = (err) => {
            this.$refs.refAuthErrorDialog.open({
              errorTitle: "Failed to process password reset request!",
              errorMsg: `Reason: ${err.message}`,
              actionable: false,
            });
          };
          this.forgotPassword({ email, successCallback, errorCallback });
        });
    },

    // map vuex actions
    ...mapActions([
      "authenticateUser",
      "confirmRegistration",
      "resendConfirmationCode",
      "signUp",
      "forgotPassword",
      "confirmPassword",
    ]),
  },
};
</script>

<style scoped>
.v-dialog > .v-card > .v-card__text {
  padding: 20px 24px 12px;
}

.v-progress-circular {
  margin-left: 1.5rem;
}
</style>
