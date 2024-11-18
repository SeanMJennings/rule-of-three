import {describe, it} from "vitest";
import {
    allows_navigation_to_tasks_when_logged_in,
    allows_user_to_navigate_back_to_landing_page,
    does_not_allow_navigation_to_tasks_when_logged_out,
    tasks_page_link_invisible_when_user_not_logged_in,
    lets_user_log_out,
    subscribes_to_user_token_changes,
    render_tasks_page_link_when_user_logged_in,
    renders_error_boundary_for_uncaught_error,
    renders_landing_page,
    renders_landing_page_by_the_default,
    renders_login_user_when_not_logged_in,
    renders_logout_user_when_logged_in,
    allows_user_to_navigate_to_landing_clicking_header_title
} from "@/specs/App.steps";

describe("App", () => {
    it("renders landing page", renders_landing_page);
    it("renders login user when not logged in", renders_login_user_when_not_logged_in);
    it("renders logout user when logged in", renders_logout_user_when_logged_in);
    it("subscribes to user token changes", subscribes_to_user_token_changes);
    it("lets user log out", lets_user_log_out);
    it("renders tasks page link when user logged in", render_tasks_page_link_when_user_logged_in);
    it("tasks page link invisible when user not logged in", tasks_page_link_invisible_when_user_not_logged_in);
    it("does not allow navigation to tasks when logged out", does_not_allow_navigation_to_tasks_when_logged_out);
    it("allows navigation to tasks when logged in", allows_navigation_to_tasks_when_logged_in);
    it("allows user to navigate to landing clicking header title", allows_user_to_navigate_to_landing_clicking_header_title)
    it("allows user to navigate back to landing page", allows_user_to_navigate_back_to_landing_page);
    it("renders landing page by default", renders_landing_page_by_the_default);
    it("renders error boundary for uncaught error", renders_error_boundary_for_uncaught_error);
});
