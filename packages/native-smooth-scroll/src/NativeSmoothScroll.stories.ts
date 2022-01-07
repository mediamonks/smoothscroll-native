/* eslint-disable max-lines */
import global from 'global';
import { useEffect } from '@storybook/client-api';
import gsap from 'gsap';

import './styles.css';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { NativeSmoothScroll, NativeSmoothScrollOptions } from './NativeSmoothScroll';
import type { NativeSmoothScrollElementOptions } from './NativeSmoothScrollElement';

export default {
  title: 'NativeSmoothScroll',
};

const getNativeSmoothScrollInstance = (
  containerSelector: string,
  options?: NativeSmoothScrollOptions,
) => {
  const container = global.document.querySelector<HTMLElement>(containerSelector);

  if (container) {
    const instance = new NativeSmoothScroll();
    instance.init(container, options);

    return instance;
  }

  return null;
};

const addScrollElements = (
  instance: NativeSmoothScroll | null,
  selector: string,
  options?: NativeSmoothScrollElementOptions,
) => {
  if (instance) {
    const scrollElements = Array.from(global.document.querySelectorAll<HTMLElement>(selector));

    return scrollElements.map((block) => instance.addElement(block, options));
  }

  return [];
};

const defaultHtml = `<div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2</div>
      <div class="scroll-element scroll-element-3">3</div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>`;

export const Default = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');

    addScrollElements(nativeSmoothScroll, '.scroll-element');

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return defaultHtml;
};

export const Sticky = (props: { sticky: boolean }) => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');

    if (nativeSmoothScroll) {
      const scrollElements = Array.from(
        global.document.querySelectorAll<HTMLElement>('.scroll-element'),
      );

      scrollElements.forEach((block, index) => {
        nativeSmoothScroll.addElement(block, { sticky: props.sticky && index === 2 });
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `<div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2</div>
      <div class="scroll-element scroll-element-3">3 (sticky if enabled)</div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>`;
};

Sticky.args = {
  sticky: true,
};

export const Lerp = (props: { lerp: number }) => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container', {
      lerp: props.lerp,
    });
    addScrollElements(nativeSmoothScroll, '.scroll-element');

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return defaultHtml;
};

Lerp.args = {
  lerp: 0.1,
};

Lerp.argTypes = {
  lerp: {
    control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
  },
};

export const RemoveElement = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');

    addScrollElements(nativeSmoothScroll, '.scroll-element');

    const removeButton = global.document.querySelector<HTMLElement>('#removeButton');

    if (removeButton) {
      removeButton.addEventListener('click', () => {
        const elements = Array.from(
          global.document.querySelectorAll<HTMLElement>('.scroll-element'),
        );

        const element = elements[Math.floor(Math.random() * elements.length)];

        if (element && element.parentNode) {
          element.parentNode.removeChild(element);

          nativeSmoothScroll?.removeElement(element);
        }
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `
    <div class="button-bar"><button id="removeButton" class="btn btn-primary">Remove element</button></div>
    ${defaultHtml}
   `;
};

export const EnableDisable = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');

    addScrollElements(nativeSmoothScroll, '.scroll-element');

    const checkbox = global.document.querySelector<HTMLInputElement>('#enabled');

    if (checkbox) {
      nativeSmoothScroll?.setIsEnabled(checkbox.checked);

      checkbox.addEventListener('change', () => {
        nativeSmoothScroll?.setIsEnabled(checkbox.checked);
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `
    <div class="button-bar">
      <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" checked id="enabled">
          <label class="form-check-label" for="enabled">
              Enabled
          </label>
      </div>
    </div>
    ${defaultHtml}
   `;
};

export const StickyElement = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');

    if (nativeSmoothScroll) {
      const scrollElements = Array.from(
        global.document.querySelectorAll<HTMLElement>('.scroll-element'),
      );

      scrollElements.forEach((block, index) => {
        nativeSmoothScroll.addElement(block, {
          sticky: index === 2,
          stickyElement: index === 2 ? block.querySelector<HTMLElement>('.sticky') : null,
        });
      });

      const checkbox = global.document.querySelector<HTMLInputElement>('#enabled');

      if (checkbox) {
        nativeSmoothScroll?.setIsEnabled(checkbox.checked);

        checkbox.addEventListener('change', () => {
          nativeSmoothScroll?.setIsEnabled(checkbox.checked);
        });
      }
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `
    <div class="button-bar">
      <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" checked id="enabled">
          <label class="form-check-label" for="enabled">
              Smooth Scroll Enabled
          </label>
      </div>
    </div>
    <div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2</div>
      <div class="scroll-element scroll-element-3"><div class="sticky">I am a sticky element</div></div>
      <div class="scroll-element scroll-element-4">4</div>
    </div>
  `;
};

export const Lock = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');
    addScrollElements(nativeSmoothScroll, '.scroll-element');

    const lockCheckbox = global.document.querySelector<HTMLInputElement>('#locked');
    const enableCheckbox = global.document.querySelector<HTMLInputElement>('#enabled');

    if (lockCheckbox) {
      lockCheckbox.addEventListener('change', () => {
        if (lockCheckbox.checked) {
          disableBodyScroll(lockCheckbox);
        } else {
          enableBodyScroll(lockCheckbox);
        }
      });
    }

    if (enableCheckbox) {
      nativeSmoothScroll?.setIsEnabled(enableCheckbox.checked);

      enableCheckbox.addEventListener('change', () => {
        nativeSmoothScroll?.setIsEnabled(enableCheckbox.checked);
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }

      if (lockCheckbox) {
        enableBodyScroll(lockCheckbox);
      }
    };
  });

  return `
     <div class="button-bar">
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="locked">
            <label class="form-check-label" for="locked">
                Locked
            </label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" checked id="enabled">
            <label class="form-check-label" for="enabled">
                Smooth Scroll Enabled
            </label>
        </div>
      </div>
      <div>
      ${defaultHtml}
   `;
};

export const ScrollTo = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');
    const instances = addScrollElements(nativeSmoothScroll, '.scroll-element');

    const lockCheckbox = global.document.querySelector<HTMLInputElement>('#locked');
    const enableCheckbox = global.document.querySelector<HTMLInputElement>('#enabled');

    if (lockCheckbox) {
      lockCheckbox.addEventListener('change', () => {
        if (lockCheckbox.checked) {
          disableBodyScroll(lockCheckbox);
        } else {
          enableBodyScroll(lockCheckbox);
        }
      });
    }

    if (enableCheckbox) {
      nativeSmoothScroll?.setIsEnabled(enableCheckbox.checked);

      enableCheckbox.addEventListener('change', () => {
        nativeSmoothScroll?.setIsEnabled(enableCheckbox.checked);
      });
    }

    const getScrollOptions = () => {
      return {
        align:
          (global.document.querySelector<HTMLInputElement>('input[name="align"]:checked')?.value as
            | 'top'
            | 'middle'
            | 'bottom') || 'top',
        shouldIgnoreWhenVisible:
          global.document.querySelector<HTMLInputElement>('#ignore')?.checked || false,
      };
    };

    const randomElement = global.document.querySelector<HTMLInputElement>('#randomElement');
    const elementScrollButton =
      global.document.querySelector<HTMLInputElement>('#elementScrollButton');
    const idScrollButton = global.document.querySelector<HTMLInputElement>('#idScrollButton');
    const instanceScrollButton =
      global.document.querySelector<HTMLInputElement>('#instanceScrollButton');
    const instanceElementScrollButton = global.document.querySelector<HTMLInputElement>(
      '#instanceElementScrollButton',
    );
    const positionScrollButton =
      global.document.querySelector<HTMLInputElement>('#positionScrollButton');

    elementScrollButton?.addEventListener('click', () => {
      if (randomElement) {
        nativeSmoothScroll?.scrollTo(randomElement, getScrollOptions());
      }
    });

    idScrollButton?.addEventListener('click', () => {
      nativeSmoothScroll?.scrollTo('idElement', getScrollOptions());
    });

    instanceScrollButton?.addEventListener('click', () => {
      if (instances[1]) {
        nativeSmoothScroll?.scrollTo(instances[1], getScrollOptions());
      }
    });

    instanceElementScrollButton?.addEventListener('click', () => {
      if (instances[3] && instances[3].element) {
        nativeSmoothScroll?.scrollTo(instances[3].element, getScrollOptions());
      }
    });

    positionScrollButton?.addEventListener('click', () => {
      nativeSmoothScroll?.scrollTo(
        (document.documentElement.scrollHeight - window.innerHeight) * Math.random(),
        getScrollOptions(),
      );
    });

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }

      if (lockCheckbox) {
        enableBodyScroll(lockCheckbox);
      }
    };
  });

  return `
     <div class="button-bar">
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" id="locked">
            <label class="form-check-label" for="locked">
                Locked
            </label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" checked id="enabled">
            <label class="form-check-label" for="enabled">
                Smooth Scroll Enabled
            </label>
        </div>
        <div>
          <button id="elementScrollButton" class="btn btn-primary">Scroll to element</button>
          <button id="idScrollButton" class="btn btn-primary">Scroll to id</button>
          <button id="instanceScrollButton" class="btn btn-primary">Scroll to instance</button>
          <button id="instanceElementScrollButton" class="btn btn-primary">Scroll to instance element</button>
          <button id="positionScrollButton" class="btn btn-primary">Scroll to random position</button>
        </div>
        <div>
          Align:
          <div class="form-check-inline">
            <input class="form-check-input" type="radio" name="align" id="alignTop" checked value="top">
            <label class="form-check-label" for="alignTop">
              Top
            </label>
          </div>
          <div class="form-check-inline">
            <input class="form-check-input" type="radio" name="align" id="alignMiddle" value="middle">
            <label class="form-check-label" for="alignMiddle">
              Middle
            </label>
          </div>
          <div class="form-check-inline">
            <input class="form-check-input" type="radio" name="align" id="alignBottom" value="bottom">
            <label class="form-check-label" for="alignBottom">
              Bottom
            </label>
          </div>
        </div>
        <div class="form-check form-check-inline">
              <input class="form-check-input" type="checkbox" id="ignore">
              <label class="form-check-label" for="ignore">
                  Should Ignore When Visible
              </label>
          </div>
      </div>
      <div id="scroll-container">
        <div class="scroll-element scroll-element-1">1 <div id="randomElement">I am an element</div></div>
        <div class="scroll-element scroll-element-2">2 (I am an instance)</div>
        <div class="scroll-element scroll-element-3" id="idElement">3 (I have an id)</div>
        <div class="scroll-element scroll-element-4">4 (I am an instance element)</div>
        <div class="scroll-element scroll-element-3">5</div>
        <div class="scroll-element scroll-element-3">6</div>
      </div>
   `;
};

export const Tab = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container');
    addScrollElements(nativeSmoothScroll, '.scroll-element');

    const enableCheckbox = global.document.querySelector<HTMLInputElement>('#enabled');

    if (enableCheckbox) {
      nativeSmoothScroll?.setIsEnabled(enableCheckbox.checked);

      enableCheckbox.addEventListener('change', () => {
        nativeSmoothScroll?.setIsEnabled(enableCheckbox.checked);
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `
     <div class="button-bar">
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" checked id="enabled">
            <label class="form-check-label" for="enabled">
                Smooth Scroll Enabled
            </label>
        </div>
      </div>
     <div id="scroll-container">
        <div class="scroll-element scroll-element-1">1 <button class="btn btn-primary">Button</button></div>
        <div class="scroll-element scroll-element-2">2 <button class="btn btn-primary">Button</button></div>
        <div class="scroll-element scroll-element-3">3 <button class="btn btn-primary">Button</button></div>
        <div class="scroll-element scroll-element-4">4 <button class="btn btn-primary">Button</button></div>
      </div>
   `;
};

export const ResizeObserver = () => {
  useEffect(() => {
    const nativeSmoothScroll = getNativeSmoothScrollInstance('#scroll-container', {
      isResizeObserverEnabled: true,
    });

    const instances = addScrollElements(nativeSmoothScroll, '.scroll-element');

    const button = global.document.querySelector<HTMLElement>('#button');

    if (button) {
      button.addEventListener('click', () => {
        if (instances[1]) {
          gsap.set(instances[1].element, { height: 200 + Math.random() * 1000 });
        }
      });
    }

    return () => {
      if (nativeSmoothScroll) {
        nativeSmoothScroll.destruct();
      }
    };
  });

  return `
    <div id="scroll-container">
      <div class="scroll-element scroll-element-1">1</div>
      <div class="scroll-element scroll-element-2">2 <button id="button" class="btn btn-primary">Change Size</button></div>
      <div class="scroll-element scroll-element-3">3 </div>
      <div class="scroll-element scroll-element-4">4 </div>
    </div>
  `;
};
