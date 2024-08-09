<template>
  <div class="center">
    <div class="content item-center">
      <div class="header">Version 2.0.0</div>
      <div class="paragraph">The long-awaited version 2.0.0 of UFO bot has been released! In this update, the bot has
        been completely rewritten in TypeScript. At the same time, the bot was remade for new features of Discord, a lot
        of new functions were added, old ones reworked, and many were bugs fixed.</div>
      <div class="subtitle">General</div>
      <div class="paragraph">1. New logo and bot avatar.</div>
      <div class="paragraph">2. Added
        <image-overlay name="Slash commands" file="en/slashes.png">slash commands</image-overlay>. Their language does
        not depend on server commands language, it is set in accordance with your Discord client language: Russian, if
        your client language is Russian, in other cases English. Text commands remain in the bot.
      </div>
      <div class="paragraph">3. Now instead of reactions bot uses Discord
        <image-overlay name="Interactions" file="en/interactions.png">interactions</image-overlay> (buttons, selects,
        modals, etc.).</div>
      <div class="subtitle">Website</div>
      <div class="paragraph">1. Website has also been rewritten in Typescript and Vue 3 framework.</div>
      <div class="paragraph">2. Updated color palette of the website.</div>
      <div class="paragraph">3. Fixed bug where in some browsers some components were not centered.</div>
      <div class="paragraph">4. Now language changes without reloading the page.</div>
      <div class="paragraph">5. New user <image-overlay name="Badges" file="en/badges.png">badges</image-overlay>
        on profile page.
      </div>
      <div class="paragraph">6. Now all servers settings are cached. If you open server settings, they will load only
        once. After that you can move between pages and settings of this server will not load anymore.
      </div>
      <div class="paragraph">7. Commands settings will now also update permission overrides for slash commands.
        To do this, you need to authorize again on the website to give the application permissions to update slash
        commands
      </div>
      <div class="paragraph">8. Added new
        <image-overlay name="Template input" file="en/template.png">template input</image-overlay>. It contains text
        field and buttons for inserting role mention, channel mention, template variable and link to templates
        documentation.
      </div>
      <div class="paragraph">9. The boost tab has been removed from server settings. Now all donate features can be
        configured in settings category which they belong to. For example, money bonuses are configured in Economy tab.
      </div>
      <div class="paragraph">10. Added
        <router-link class="primary-link" to="/terms">Terms of Service</router-link> and
        <router-link class="primary-link" to="/privacy">Privacy Policy</router-link>.
        Links to them are located in the footer.
      </div>
      <div class="subtitle">Economy</div>
      <div class="paragraph">1. Commands for balance managing <code>add-money</code>, <code>remove money</code>
        and <code>set-balance</code> have been replaced by command <code>balance-manager
          &ltmember&gt &ltadd | remove | set&gt &ltamount&gt</code>.</div>
      <div class="paragraph">2. Minimum bets are now set for all games at once.</div>
      <div class="paragraph">3. Donate feature "Money for messages" has been removed, added "Experience for messages"
        instead. You can set random amount of experience that will be given to members with specified chance when
        sending messages.
      </div>
      <div class="paragraph">4. Now in <image-overlay name="Leaders" file="en/leaders.png">leaders</image-overlay> and
        <image-overlay name="Магазин" file="en/shop.png">shop</image-overlay> commands you can switch pages using
        arrow buttons
      </div>
      <div class="paragraph">5. Shop</div>
      <div class="subparagraph">5.1. Now you can set required experience for item. In this case, members will not be
        able to buy this item if they have less experience.
      </div>
      <div class="subparagraph">5.2. Now given experience for buying item can be made random by setting minimum and
        maximum values. If you want to set fixed value, enter it in minimum and maximum fields.
      </div>
      <div class="subparagraph">5.3. Now you can set required roles for item. If member does not have at least one of
        these roles, they will be unable to buy this item.
      </div>
      <div class="subparagraph">5.4. As a donate feature, you can set item icon (you have to set image URL in item
        settings). It will be displayed in item info and when buying it as embed thumbnail.
      </div>
      <div class="paragraph">6. Custom jobs</div>
      <div class="subparagraph">6.1. Added custom jobs. Now instead of default work you can set custom jobs with their
        own options on your server.
      </div>
      <div class="subparagraph">6.2. You can create, edit or delete custom jobs on the website. They have following
        options: name, description, ending message, salary (minimum and maximum), cooldown, required experience and
        required roles.
      </div>
      <div class="subparagraph">6.3. In custom jobs you can set both positive and negative salary values.</div>
      <div class="subparagraph">6.4. Job ending message is a message template that will be displayed to members if they
        select this job. It contains <code>&#123&#123work&#125&#125</code> variable, which contains information about
        salary and member balance. By using conditions you can set different text in this message for different salary
        values. If the message is not set, the default message will be displayed as in default job. More information
        about message templates can be found in
        <a class="primary-link" href="https://docs.ufobot.ru/templates/usage" target="_blank">Documentation</a>.
      </div>
      <div class="subparagraph">6.5. If custom jobs are set on the server, member will see
        <image-overlay name="Job selection" file="en/job-menu.png">list </image-overlay> of all jobs names when using
        <code>work</code> command. By selecting one of the jobs, member will see all its
        <image-overlay name="Job options" file="en/job-select.png">options</image-overlay>. If the job is available
        for member (cooldown passed and they have required experience and roles), they will be able to click Work
        button. They will receive a random salary value between minimum and maximum value and job ending
        <image-overlay name="Job ending" file="en/job-ending.png">message</image-overlay> will be displayed.
      </div>
      <div class="subparagraph">6.6. As a donate feature, you can set job icon (you have to set image URL in job
        settings). It will be displayed in job information and after work as embed thumbnail.
      </div>
      <div class="subtitle">Games</div>
      <div class="paragraph">1. As mentioned above, games now use Discord interactions instead of reactions.
      </div>
      <div class="paragraph">2. In <image-overlay name="Crash casino" file="en/crash.png">crash-casino</image-overlay>
        you can now raise the multiplier with "Raise" button. To stop and take money, you need to click "Stop" button.
        Multiplier is now raised by 0.4 with each raising, and chance of losing is now 25%.
      </div>
      <div class="paragraph">3. <image-overlay name="Minefield" file="en/minefield.png">Minefield</image-overlay>
        now contains 3 arrow buttons for selecting cell and a button with "stop" icon to stop. Multipliers in minefield
        are now x1 and x2.
      </div>
      <div class="paragraph">4. <image-overlay name="Jackpot" file="en/jackpot.png">Jackpot</image-overlay> now contains
        "Enter" button, which opens
        <image-overlay name="Modal window" file="en/jackpot-modal.png">modal window</image-overlay> that contains
        input field. You need to enter 7 numbers separated by space and click "Submit".
      </div>
      <div class="paragraph">5. Rock scissors paper</div>
      <div class="subparagraph">5.1. Contains
        <image-overlay name="Rock scissors paper" file="en/rsp.png">select menu</image-overlay> in which you can choose
        rock, scissors or paper.
      </div>
      <div class="subparagraph">5.2. Now you can play rock scissors paper with another member. To do this you need to
        specify member after the bet. They can
        <image-overlay name="Accepting game" file="en/rsp-accept.png">accept or decline</image-overlay> game using
        buttons. Then each member can
        <image-overlay name="Select" file="en/rsp-player.png">select</image-overlay> rock, scissors or paper.
        <image-overlay name="Winner" file="en/rsp-winner.png">Winner</image-overlay> will receive money.
      </div>
      <div class="paragraph">6. <image-overlay name="New duels" file="en/duel.png">New duels</image-overlay></div>
      <div class="subparagraph">6.1. Duel game has been fully reworked and improved. Not each player has 100 HP at
        start, each shot gives random amount of damage. Also added equipment: helmet, armor, scope, medkit and grenade.
        At start players can select 2 elements of equipment.
      </div>
      <div class="subparagraph">6.2. When using command, you need to specify member who you want to play with, they will
        be able to accept or decline the game. Then each player need to select up to 2 elements of
        <image-overlay name="Equipment" file="en/duel-equipment.png">equipment</image-overlay> from the list.
        Then players damage each other. Whoever runs out of HP will lose.
      </div>
      <div class="subparagraph">6.3. Each shot can hit different part of the body with certain chance.
      </div>
      <div class="subparagraph">6.4. Bullet can hit leg with 40% chance if player does not have scope, and with 15%
        chance if player has scope. Applies from 1 to 15 damage to opponent.
      </div>
      <div class="subparagraph">6.5. Bullet can hit body with 55% chance if player does not have scope, and with 75%
        chance if player has scope. Applies from 10 to 40 damage if opponent does not have armor, and from 5 to 20
        damage if opponent has armor.
      </div>
      <div class="subparagraph">6.6. Headshot occur with 5% chance if player does not have scope, and with 10% chance
        if player has scope. Applies 100 damage to opponent and kills them instantly if they have no helmet. If opponent
        has a helmet, they get 30 damage and their helmet gets destroyed (removed from inventory).
      </div>
      <div class="subparagraph">6.7. Instead of shooting, player can use medkit, if they have one in inventory, by
        clicking "MedKit" button. Medkit restores restores 50 HP and then gets removed from inventory.
      </div>
      <div class="subparagraph">6.8. Instead of shooting, player can use a grenade, if they have one in inventory, by
        clicking "Grenade" button. Grenade applies from 20 to 60 damage to opponent.
      </div>
      <div class="subtitle">Greetings</div>
      <div class="paragraph">1. Greetings system has been completely reworked. Now they can contain embed with text
        message.
      </div>
      <div class="paragraph">2. You can use template variables both in text message and in embed. Greetings contain
        <code>&#123&#123member&#125&#125</code> and <code>&#123&#123guild&#125&#125</code> variables. More information
        about message templates can be found in
        <a class="primary-link" href="https://docs.ufobot.ru/templates/usage" target="_blank">Documentation</a>.
      </div>
      <div class="paragraph">3. Text message is now entered into a new template input, which was already mentioned
        above.
      </div>
      <div class="paragraph">4. Instead of text message or with it, you can use embed. Turn on the switch located
        next to Embed button. Then click button to open embed settings. There you can set color, add author, title,
        description, fields, footer, timestamp and set thumbnail and image. You can use template variables in every
        embed option. For example, you can set member avatar as author icon by entering in "Author icon Url" value
        <code>&#123&#123member.avatarUrl&#125&#125</code>.
      </div>
      <div class="paragraph">5. As a timestamp, you can select current time (time of event), select a specific date, or
        select a template variable from the list.
      </div>
      <div class="paragraph">6. Added <image-overlay name="Tests" file="en/greetings-tests.png">tests</image-overlay>
        for greetings. With them you can check that messages, embeds and all templates are filled correctly. Once the
        test is launched, a corresponding message will be sent to the appropriate channel or DM.
      </div>
      <div class="subtitle">Moderation</div>
      <div class="paragraph">1. Now in case of mute, if its duration is less than 28 days, the member will also be timed
        out. By default, this setting is enabled, but you can disable it on the website in settings in Moderation tab.
      </div>
      <div class="paragraph">2. Donate feature "Punishments DM messages" has been reworked. Now this messages can also
        contain embed with text message. Also added tests for you to check that messages, embeds and all templates are
        filled correctly. After running the test, corresponding message will be sent to you in DM.
      </div>
      <div class="paragraph">3. Reworked automoderation</div>
      <div class="subparagraph">3.1. Now in automoderation filter settings you can enable punishment issuing and sending
        a message. This message could be, for example, a verbal warning for member or a mention of moderator role. It
        can also be send to specific channel.
      </div>
      <div class="subparagraph">3.2. Added new automoderation filter: Flood. It has two options: maximum messages per
        minute and maximum characters per minute. If this number of messages or sum of characters is exceeded by member
        in less than minute, the bot will respond to this.
      </div>
      <div class="subtitle">Donate</div>
      <div class="paragraph">1. As mentioned above, the "Money for messages" feature has been replaced with "Experience
        for messages". Also you can set icons for items and custom jobs.
      </div>
      <div class="paragraph">2. New limits</div>
      <div class="subparagraph">2.1. Limit of items in the shop: 30. For servers without UFO boost: 15.</div>
      <div class="subparagraph">2.2. Limit of custom jobs: 15. For servers without UFO boost: 5.</div>
      <div class="subparagraph">2.3. Limit of giveaways: 15. For servers without UFO boost: 5.</div>
      <div class="subparagraph">2.4. Limit of coupons: 15. For servers without UFO boost: 5.</div>
      <div class="paragraph">3. New prices: 59₽/month for standard and 99₽/month for premium.</div>
      <div class="subtitle">Deleted settings</div>
      <div class="paragraph">1. Unfortunately, due to rework of some functions, we are unable to save previous settings,
        so you will need to configure these functions again.
      </div>
      <div class="subparagraph">1.1. Deleted previous greetings settings.</div>
      <div class="subparagraph">1.2. Deleted previous punishments DM messages settings.</div>
      <div class="subparagraph">1.3. Deleted previous automoderation settings.</div>
      <div class="subparagraph">1.4. Deleted previous work and moneybags settings.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageOverlay from "@/components/v2/ImageOverlay.vue";
</script>

<style scoped>
.content {
  max-width: 90%;
}

.header {
  font-size: 2.5em;
  font-weight: bold;
  margin-top: 5px;
}

.subtitle {
  font-size: 2em;
  margin-top: 5px;
}

.paragraph {
  font-size: 1.2em;
  text-align: left;
  margin-top: 10px;
}

.subparagraph {
  text-align: left;
  font-size: 1em;
}
</style>