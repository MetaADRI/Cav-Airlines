# CAV-Zambia-Airlines
COM322 (Group 2) - Web Design and Development Project
``html
<div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px; font-family: sans-serif; line-height: 1.6;">
  <p style="color: red; font-weight: bold;">
    (This part can be erased after everyone is clear with what's going on)
  </p>

  <p>
    In this project, we’re using a main CSS file called 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">common.css</span> 
    to store all the default styles that are shared across the entire website.
  </p>

  <p>
    Inside 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">common.css</span>, 
    we define reusable CSS variables under the 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">:root</span> 
    selector — like 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">--montserrat-font</span> 
    and 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">--oxygen-font</span> 
    for fonts, and 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">--purple-color</span> 
    and 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">--white-color</span> 
    for colors.
  </p>

  <p>
    These variables help us keep our design consistent and make it easy to make changes in one place instead of repeating the same styles on every page.
  </p>

  <p>
    If we want to use these variables in other CSS files like 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">home.css</span> 
    or 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">about.css</span>, 
    we just import 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">common.css</span> 
    at the top using 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">@import url('common.css');</span>.
  </p>

  <p>
    Then we can use the variables by writing things like 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">font-family: var(--montserrat-font);</span> 
    or 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">color: var(--purple-color);</span>.
  </p>

  <p>
    We're also going to include the default styles for the navigation bar 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">&lt;nav&gt;</span> 
    in 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">common.css</span>. 
    That way, the nav bar will have the same font, colors, layout, and spacing on every page without having to copy the styles into each file.
  </p>

  <p>
    Adding the nav bar styling to 
    <span style="background-color: #f3f3f3; padding: 2px 4px; border-radius: 4px;">common.css</span> 
    makes our code cleaner, easier to manage, and ensures the navigation looks the same across the whole site.
  </p>
</div>
``
