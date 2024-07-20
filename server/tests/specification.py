import pytest

context = dict()


@pytest.fixture(autouse=True)
def before_each():
    global context
    context = dict()


def Given(action, *args):
    if callable(action):
        action(context, *args)


def Given(action):
    if callable(action):
        action()


def When(action, *args):
    if callable(action):
        action(context, *args)


def When(action):
    if callable(action):
        action()


def Then(action, *args):
    if callable(action):
        action(context, *args)


def Then(action):
    if callable(action):
        action()


def And(action, *args):
    if callable(action):
        action(context, *args)


def And(action):
    if callable(action):
        action()
