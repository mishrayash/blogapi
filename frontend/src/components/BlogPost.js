import React from "react";

const BlogPost = () => {
  return (
    <div className=" w-[780px] ml-10 text-2xl mb-[150px]">
      <h1 className="text-[33px]">A Complete Guide to useEffect</h1>
      <br></br>
      <p>March 9, 2019</p>

      <p className="text-xl">
        You wrote a few components with Hooks. Maybe even a small app. You’re
        mostly satisfied.<br></br> You’re comfortable with the API and picked up
        a few tricks along the way. You even made some custom Hooks to extract
        repetitive logic (300 lines gone!) and showed it off to your colleagues.
        “Great job”, they said.
      </p>

      <br />

      <p className="text-2xl mt-4 mb-6">
        But sometimes when you useEffect, the pieces don’t quite fit together.
        You have a nagging feeling that you’re missing something. It seems
        similar to class lifecycles… but is it really? You find yourself asking
        questions like:
      </p>

      <ul className="list-disc pl-6 mb-6">
        <li className="mb-3">
          🤔 How do I replicate componentDidMount with useEffect?
        </li>
        <li className="mb-3">
          🤔 How do I correctly fetch data inside useEffect? What is []?
        </li>
        <li className="mb-3">
          🤔 Do I need to specify functions as effect dependencies or not?
        </li>
        <li className="mb-3">
          🤔 Why do I sometimes get an infinite refetching loop?
        </li>
        <li className="mb-3">
          🤔 Why do I sometimes get an old state or prop value inside my effect?
        </li>
      </ul>

      <p className="mb-3">
        When I just started using Hooks, I was confused by all of those
        questions too. Even when writing the initial docs, I didn’t have a firm
        grasp on some of the subtleties. I’ve since had a few “aha” moments that
        I want to share with you. This deep dive will make the answers to these
        questions look obvious to you.
      </p>

      <p className="mb-3">
        To see the answers, we need to take a step back. The goal of this
        article isn’t to give you a list of bullet point recipes. It’s to help
        you truly “grok” useEffect. There won’t be much to learn. In fact, we’ll
        spend most of our time unlearning.
      </p>

      <p className="mb-3">
        It’s only after I stopped looking at the useEffect Hook through the
        prism of the familiar class lifecycle methods that everything came
        together for me.
      </p>
      <div id="video" className="mb-6 ml-[100px]">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/0ZJgIjIuY7U"
          title="Your Video Title"
          frameborder="2"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <p className="mb-3">“Unlearn what you have learned.” — Yoda</p>

      <p className="mb-3">
        This article assumes that you’re somewhat familiar with useEffect API.
      </p>

      <p className="mb-3">
        It’s also really long. It’s like a mini-book. That’s just my preferred
        format. But I wrote a TLDR just below if you’re in a rush or don’t
        really care.
      </p>

      <h2>TLDR</h2>

      <p className="mb-3">
        Here’s a quick TLDR if you don’t want to read the whole thing. If some
        parts don’t make sense, you can scroll down until you find something
        related.
      </p>

      <p className="mb-3">
        Feel free to skip it if you plan to read the whole post. I’ll link to it
        at the end.
      </p>

      <div id="image" className="mb-6">
        <img
          src="https://dmitripavlutin.com/d0532a1ba251b6730f64aff0a02b0925/react-useeffect-hook-cleanup.svg"
          alt="Description for Image 1"
          className="w-full"
        />
      </div>

      <ul className="list-disc pl-6 mb-6">
        <li className="mb-3">
          🤔 Question: How do I replicate componentDidMount with useEffect?
          <br />
          While you can useEffect(fn, []), it’s not an exact equivalent. Unlike
          componentDidMount, it will capture props and state. So even inside the
          callbacks, you’ll see the initial props and state. If you want to see
          “latest” something, you can write it to a ref. But there’s usually a
          simpler way to structure the code so that you don’t have to. Keep in
          mind that the mental model for effects is different from
          componentDidMount and other lifecycles, and trying to find their exact
          equivalents may confuse you more than help. To get productive, you
          need to “think in effects”, and their mental model is closer to
          implementing synchronization than to responding to lifecycle events.
        </li>

        <li className="mb-3">
          🤔 Question: How do I correctly fetch data inside useEffect? What is
          []?
          <br />
          This article is a good primer on data fetching with useEffect. Make
          sure to read it to the end! It’s not as long as this one. [] means the
          effect doesn’t use any value that participates in React data flow, and
          is for that reason safe to apply once. It is also a common source of
          bugs when the value actually is used. You’ll need to learn a few
          strategies (primarily useReducer and useCallback) that can remove the
          need for a dependency instead of incorrectly omitting it.
        </li>

        <li className="mb-3">
          🤔 Question: Do I need to specify functions as effect dependencies or
          not?
          <br />
          The recommendation is to hoist functions that don’t need props or
          state outside of your component, and pull the ones that are used only
          by an effect inside of that effect. If after that your effect still
          ends up using functions in the render scope (including function from
          props), wrap them into useCallback where they’re defined, and repeat
          the process. Why does it matter? Functions can “see” values from props
          and state — so they participate in the data flow. There’s a more
          detailed answer in our FAQ.
        </li>

        <li className="mb-3">
          🤔 Question: Why do I sometimes get an infinite refetching loop?
          <br />
          This can happen if you’re doing data fetching in an effect without the
          second dependencies argument. Without it, effects run after every
          render — and setting the state will trigger the effects again. An
          infinite loop may also happen if you specify a value that always
          changes in the dependency array. You can tell which one by removing
          them one by one. However, removing a dependency you use (or blindly
          specifying []) is usually the wrong fix. Instead, fix the problem at
          its source. For example, functions can cause this problem, and putting
          them inside effects, hoisting them out, or wrapping them with
          useCallback helps. To avoid recreating objects, useMemo can serve a
          similar purpose.
        </li>

        <li className="mb-3">
          🤔 Why do I sometimes get an old state or prop value inside my effect?
          <br />
          Effects always “see” props and state from the render they were defined
          in. That helps prevent bugs but in some cases can be annoying. For
          those cases, you can explicitly maintain some value in a mutable ref
          (the linked article explains it at the end). If you think you’re
          seeing some props or state from an old render but don’t expect it, you
          probably missed some dependencies. Try using the lint rule to train
          yourself to see them. A few days, and it’ll be like a second nature to
          you.
        </li>
      </ul>

      <p>Thank you!!</p>
    </div>
  );
};

export default BlogPost;
