<template>
  <div class="bg-light">
    <div class="container-fluid" style="width: 400px">
      <h1 class="text-center">One Support Assistant</h1>
      <table class="table table-bordered">
        <thead>
          <tr class="table-primary">
            <td>Customer Email</td>
            <td>Number of Tickets</td>
          </tr>
        </thead>
        <tbody>
          <tr class="table-secondary">
            <td
              id="email"
              style="vertical-align: middle; text-align: left"
            ></td>
            <td
              id="tickets"
              style="vertical-align: middle; text-align: center"
            ></td>
          </tr>
        </tbody>
      </table>
      <div class="row justify-content-md-center">
        <div class="btn-group-vertical">
          <button
            @click="greet"
            type="button"
            id="serviceDesk"
            class="btn btn-primary btn-lg btn-block"
          >
            Go to Service Desk
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "popupView",
  data() {
    return {
      email: null,
    };
  },
  methods: {
    async greet(event) {
      if (event) {
        if (!this.email) {
          await this.getEmail();
        }
        chrome.tabs.create(
          {
            url:
              "https://servicedesk.microsoft.com/#/mycases/casesByCustomerEmail/" +
              this.email,
          },
          // eslint-disable-next-line no-unused-vars
          function (_tab) {}
        );
      }
    },
    async getEmail() {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      if (!tab.url.includes("onesupport.crm.dynamics.com")) {
        // to do: enhance the error message
        const body = document.querySelector(".container-fluid");
        body.textContent = "Please open OneSupport in a tab and try again!";
        throw new Error("Not on OneSupport");
      }
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const emailAddress = document.querySelector(
            "[id$='fieldControl-mail-text-input']"
          );
          if (emailAddress === null) {
            alert(
              "Please open one ticket to wait until the email address is loaded and try again!"
            );
            throw new Error("Email address not found");
          } else {
            return emailAddress.value;
          }
        },
      });
      this.email = results[0].result;
    },
  },
};
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
