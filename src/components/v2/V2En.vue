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
        <image-overlay name="Slash commands" file="ru/slashes.png">slash commands</image-overlay>. Their language does
        not depend on server commands language, it is set in accordance with your Discord client language: Russian, if
        your client language is Russian, in other cases English. Text commands remain in the bot.
      </div>
      <div class="paragraph">3. Now instead of reactions bot uses Discord
        <image-overlay name="Interactions" file="ru/interactions.png">interactions</image-overlay> (buttons, selects,
        modals, etc.).</div>
      <div class="subtitle">Website</div>
      <div class="paragraph">1. Website has also been rewritten in Typescript and Vue 3 framework.</div>
      <div class="paragraph">2. Updated color palette of the website.</div>
      <div class="paragraph">3. Fixed bug where in some browsers some components were not centered.</div>
      <div class="paragraph">4. Now language changes without reloading the page.</div>
      <div class="paragraph">5. New user <image-overlay name="Badges" file="ru/badges.png">badges</image-overlay>
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
        <image-overlay name="Template input" file="ru/template.png">template input</image-overlay>. It contains text
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
      <div class="subtitle">Экономика</div>
      <div class="paragraph">1. Команды для управления балансом участника <code>добавить-деньги</code>,
        <code>забрать-деньги</code> и <code>установить-баланс</code> были заменены одной командой <code>баланс-менеджер
          &ltучастник&gt &ltдобавить | забрать | установить&gt &ltколичество&gt</code>.</div>
      <div class="paragraph">2. Минимальные ставки теперь устанавливаются для всех игр сразу.</div>
      <div class="paragraph">3. Донатная функция "Деньги за сообщения" удалена, вместо нее добавлен "Опыт за сообщения".
        Вы можете настроить случайное количество опыта, которое будет выдаваться с указанной вероятностью участникам при
        отправке сообщений.</div>
      <div class="paragraph">4. В команды <image-overlay name="Лидеры" file="ru/leaders.png">лидеры</image-overlay> и
        <image-overlay name="Магазин" file="ru/shop.png">магазин</image-overlay> добавлена возможность листать
        страницы с помощью кнопок-стрелочек.
      </div>
      <div class="paragraph">5. Магазин</div>
      <div class="subparagraph">5.1. Теперь в товаре можно установить необходимый для его покупки опыт. При этом опыт списываться не будет, но если у участника будет меньше опыта, купить товар он не сможет.</div>
      <div class="subparagraph">5.2. Теперь выдаваемое количество опыта при покупке товара можно сделать случайным, установив минимальное и максимальное значение. Если Вы хотите установить фиксированное значение, введите его в поле для минимального и максимального значения.</div>
      <div class="subparagraph">5.3. Теперь можно установить необходимые роли для покупки товара. Если у участника не будет хотя-бы одной из этих ролей, купить товар он не сможет.</div>
      <div class="subparagraph">5.4. В качестве донатной функции добавлена возможность установить иконку товара (необходимо указать URL картинки в настройках товара). Она будет отображаться в качестве маленькой картинки эмбеда в информации о товаре или при его покупке.</div>
      <div class="paragraph">6. Пользовательские работы</div>
      <div class="subparagraph">6.1. Добавлены пользовательские работы. Теперь вместо обычной работы Вы можете установить
        на своем сервере список из нескольких работ со своими параметрами.</div>
      <div class="subparagraph">6.2. Добавлять, изменять и удалять пользовательские работы можно на сайте. Они имеют
        следующие параметры: название, описание, сообщение по окончании работы, зарплата (минимум и максимум), кулдаун,
        необходимый опыт и необходимые роли</div>
      <div class="subparagraph">6.3. В пользовательских работах Вы можете устанавливать как положительные, так и
        отрицательные значения зарплаты</div>
      <div class="subparagraph">6.4. Сообщение по окончании работы представляет собой шаблон сообщения, который будет
        отображаться участникам, если они выберут эту работу. Оно имеет переменную <code>&#123&#123work&#125&#125</code>,
        которая содержит информацию о полученной зарплате и балансе участника. С помощью условий Вы можете установить
        разный текст этого сообщения для разных значений зарплаты. Если сообщение не устанавливать, то будет отображаться
        сообщение по умолчанию, как в обычных работах. Подробнее про шаблоны сообщений Вы можете найти в
        <a class="primary-link" href="https://docs.ufobot.ru/templates/usage" target="_blank">Документации</a>.
      </div>
      <div class="subparagraph">6.5. Если на сервере есть пользовательские работы, то при использовании команды
        <code>работать</code> участник увидит <image-overlay name="Выбор работы" file="ru/job-menu.png">список
        </image-overlay> всех названий работ. Выбрав одну из работ, участник увидит все ее
        <image-overlay name="Параметры работы" file="ru/job-select.png">параметры</image-overlay>. Если участнику
        доступна работа (прошел кулдаун и имеются необходимые роли и опыт), он сможет нажать кнопку Работать. Ему
        начислится случайное значение зарплаты в диапазоне от минимального значения до максимального и отобразится
        <image-overlay name="Конец работы" file="ru/job-ending.png">сообщение</image-overlay> по окончании работы.
      </div>
      <div class="subparagraph">6.6. В качестве донатной функции добавлена возможность установить иконку работы. Она
        будет отображаться в информации о работе и после работы как маленькая картинка в эмбеде.
      </div>
      <div class="subtitle">Игры</div>
      <div class="paragraph">1. Как уже было сказано выше, в играх вместо реакций теперь используются взаимодействия
        Discord.
      </div>
      <div class="paragraph">2. В <image-overlay name="Краш казино" file="ru/crash.png">краш-казино</image-overlay>
        поднимать множитель теперь можно кнопкой "Поднять". Чтобы остановиться и забрать деньги, нужно нажать кнопку
        "Стоп". В рамках ребаланса с каждым поднятием множитель теперь поднимается на 0.4, а вероятность проиграть
        равна 25%.
      </div>
      <div class="paragraph">3. <image-overlay name="Минное поле" file="ru/minefield.png">Минное поле</image-overlay>
        содержит 3 кнопки-стрелки для выбора клетки и кнопку со значком "стоп" для остановки. В рамках ребаланса минное
        поле теперь имеет множители x1 и x2.
      </div>
      <div class="paragraph">4. <image-overlay name="Джекпот" file="ru/jackpot.png">Джекпот</image-overlay> теперь
        содержит кнопку "Ввести", при нажатии на которую открывается
        <image-overlay name="Модальное окно" file="ru/jackpot-modal.png">модальное окно</image-overlay>, содержащее
        поле ввода. В него нужно ввести 7 чисел через пробел и нажать "Отправить".
      </div>
      <div class="paragraph">5. Камень ножницы бумага</div>
      <div class="subparagraph">5.1. Имеет
        <image-overlay name="Камень ножницы бумага" file="ru/rsp.png">меню выбора</image-overlay>, в котором можно
        выбрать камень, ножницы или бумагу.
      </div>
      <div class="subparagraph">5.2. Теперь можно играть в камень ножницы бумага с другим участником. Для этого после
        ставки нужно указать нужного участника. Он
        <image-overlay name="Принятие игры" file="ru/rsp-accept.png">принять или отклонить</image-overlay> игру с
        помощью кнопок. Затем каждый из участников сможет
        <image-overlay name="Выбор" file="ru/rsp-player.png">выбрать</image-overlay> из списка камень, ножницы или
        бумагу. <image-overlay name="Победитель" file="ru/rsp-winner.png">Победителю</image-overlay> достанутся
        выигранные деньги.
      </div>
      <div class="paragraph">6. <image-overlay name="Новые дуэли" file="ru/duel.png">Новые дуэли</image-overlay></div>
      <div class="subparagraph">6.1. Игра дуэль была полностью переработана и улучшена. Теперь у каждого игрока при
        старте 100 HP, каждый выстрел наносит случайное количество урона. Кроме этого добавлено снаряжение: шлем,
        бронежилет, прицел, аптечка и граната. При старте игроки могут выбрать 2 любых элемента снаряжения.
      </div>
      <div class="subparagraph">6.2. При вводе команды нужно указать участника, с которым вы хотите играть, и он также
        сможет принять или отклонить игру с помощью кнопок. Затем каждый игрок по очереди должен выбрать до двух
        элементов <image-overlay name="Снаряжение" file="ru/duel-equipment.png">снаряжения</image-overlay> из списка.
        Затем игроки по очереди наносят друг другу урон. Тот, у кого закончится HP, проиграет.
      </div>
      <div class="subparagraph">6.3. Каждый выстрел может с определенной вероятностью попасть в ту или иную часть тела
        и нанести разное количество урона.
      </div>
      <div class="subparagraph">6.4. Попадание в ногу происходит с вероятностью 40%, если у игрока нет прицела, и с
        вероятностью 15%, если у игрока есть прицел. Наносит от 1 до 15 единиц урона противнику.
      </div>
      <div class="subparagraph">6.5. Попадание в тело происходит с вероятностью 55%, если у игрока нет прицела, и с
        вероятностью 75%, если у игрока есть прицел. Наносит от 10 до 40 единиц урона противнику, если у него нет
        бронежилета, и от 5 до 20 единиц урона, если у него есть бронежилет.
      </div>
      <div class="subparagraph">6.6. Попадание в голову происходит с вероятностью 5%, если у игрока нет прицела, и с
        вероятностью 10%, если у игрока есть прицел. Наносит 100 единиц урона противнику и мгновенно убивает его, если
        у него нет шлема. Если у противника есть шлем, он получает 30 единиц урона, и его шлем разрушается (пропадает
        из его снаряжения).
      </div>
      <div class="subparagraph">6.7. Вместо выстрела игрок может использовать аптечку, если она есть у него в инвентаре,
        нажав на кнопку "Аптечка". Аптечка восстанавливает 50 HP, после чего пропадает из инвентаря.
      </div>
      <div class="subparagraph">6.8. Вместо выстрела игрок может использовать гранату, если она есть у него в инвентаре,
        нажав на кнопку "Граната". Граната наносит противнику от 20 до 60 единиц урона.
      </div>
      <div class="subtitle">Приветствия</div>
      <div class="paragraph">1. Полностью переработана система приветствий. Теперь они могут содержать не только
        текстовое сообщение, но и эмбед.
      </div>
      <div class="paragraph">2. Как в текстовом сообщении, так и в эмбеде можно использовать переменные шаблона.
        Приветствия содержат переменные <code>&#123&#123member&#125&#125</code> и
        <code>&#123&#123guild&#125&#125</code>. Подробнее про шаблоны сообщений Вы можете найти в
        <a class="primary-link" href="https://docs.ufobot.ru/templates/usage" target="_blank">Документации</a>.
      </div>
      <div class="paragraph">3. Ввод текстового сообщения осуществляется в новое поле для ввода шаблона, о котором уже
        было сказано выше.
      </div>
      <div class="paragraph">4. Вместо текстового сообщения или вместе с ним Вы можете использовать эмбед. Включите
        переключатель, который расположен рядом с кнопкой Эмбед. Затем нажмите кнопку, чтобы открыть окно настройки
        эмбеда. В нём Вы можете настроить цвет, добавить автора, название, описание, поля, футер, отметку времени и
        установить различные картинки и иконки. Несмотря на то, что не все поля ввода содержат кнопку для вставки
        переменной, Вы можете использовать переменные шаблона абсолютно в каждом поле. Например, Вы можете установить
        аватар участника в качестве иконки автора, введя в поле "Ссылка на иконку автора" значение
        <code>&#123&#123member.avatarUrl&#125&#125</code>.
      </div>
      <div class="paragraph">5. В качестве отметки времени Вы можете выбрать текущее время (время, в которое произошло
        событие), поставить определенную дату или выбрать переменную шаблона из списка.
      </div>
      <div class="paragraph">6. В приветствия добавлены
        <image-overlay name="Тесты" file="ru/greetings-tests.png">тесты</image-overlay>. С их помощью Вы можете
        проверить правильность настройки сообщений, эмбедов и переменных шаблона. После запуска теста соответствующее
        сообщение будет отправлено в соответствующий канал или ЛС.
      </div>
      <div class="subtitle">Модерация</div>
      <div class="paragraph">1. Теперь в случае мута, если его длительность меньше 28 дней, бот будет также
        отправлять участника в тайм-аут. По умолчанию это настройка включена, но ее можно выключить на сайте в
        настройках во вкладке Модерация.
      </div>
      <div class="paragraph">2. Переработана донатная функция "Сообщения в ЛС при наказании". Теперь эти сообщения также
        могут содержать не только текст, но и эмбед. Также были добавлены тесты, с помощью которых можно проверить
        правильность настройки сообщений, эмбедов и шаблонов. После запуска теста соответствующее сообщение будет
        отправлено Вам в ЛС.
      </div>
      <div class="paragraph">3. Переработана автомодерация</div>
      <div class="subparagraph">3.1. Теперь в настройках фильтра автомодерации на сайте можно включить не только выдачу
        наказания участнику, но и отправку сообщения. Это сообщение может быть, например, устным предупреждением
        участника о нарушении или упоминанием модераторской роли с целью сообщить о нарушении. Его также можно отправить
        в определенный канал.
      </div>
      <div class="subparagraph">3.2. Добавлен новый фильтр автомодерации: Флуд. В параметрах он содержит две настройки:
        максимум сообщений в минуту и максимум символов в минуту. Если это количество сообщений или сумма символов в
        сообщениях будет превышена участником меньше, чем за минуту, бот отреагирует на это.
      </div>
      <div class="subtitle">Донат</div>
      <div class="paragraph">1. Как уже было сказано выше, функция "Деньги за сообщения" была заменена на "Опыт за
        сообщения", а также добавлена возможность установить иконки для товаров и пользовательских работ.
      </div>
      <div class="paragraph">2. Новые лимиты</div>
      <div class="subparagraph">2.1. Лимит товаров в магазине: 30. Для серверов без UFO буста: 15.</div>
      <div class="subparagraph">2.2. Лимит пользовательских работ: 15. Для серверов без UFO буста: 5.</div>
      <div class="subparagraph">2.3. Лимит розыгрышей: 15. Для серверов без UFO буста: 5.</div>
      <div class="subparagraph">2.4. Лимит купонов: 15. Для серверов без UFO буста: 5.</div>
      <div class="paragraph">3. Новые цены: 59₽/месяц за стандарт и 99₽/месяц за премиум.</div>
      <div class="subtitle">Удаление настроек</div>
      <div class="paragraph">1. К сожалению, из-за переработки некоторых функций нам не удастся сохранить их предыдущие
        настройки, поэтому эти функции Вам нужно будет настроить заново.
      </div>
      <div class="subparagraph">1.1. Удалены предыдущие настройки приветствий.</div>
      <div class="subparagraph">1.2. Удалены предыдущие настройки сообщений в ЛС при наказании.</div>
      <div class="subparagraph">1.3. Удалены предыдущие настройки автомодерации.</div>
      <div class="subparagraph">1.4. Удалены предыдущие настройки работ и мешков.</div>
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